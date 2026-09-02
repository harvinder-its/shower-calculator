'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { QuoteState, ShowerTemplate } from '@/types';

interface Props { state: QuoteState; }

const FINISH_HEX: Record<string, number> = {
  chrome: 0xd4d4d4,
  'brushed-nickel': 0x8d8d8d,
  'matte-black': 0x222222,
  'oil-rubbed-bronze': 0x6b3e2a,
};

const GLASS_HEX: Record<string, number> = {
  clear: 0xd4eef5,
  'low-iron': 0xd8f0e8,
  'shower-guard': 0xb2ddd0,
};

// Panel descriptor in normalized units (fractions of w):
// xf  = panel center X as fraction of w (0 = shower center)
// zf  = panel center Z as fraction of w (0 = front face)
// wf  = panel width as fraction of w
// rotY = Y-axis rotation in radians
// isDoor = renders handle
interface P { xf: number; zf: number; wf: number; rotY: number; isDoor: boolean; }

const DEG45 = Math.PI / 4;
const DEG90 = Math.PI / 2;

// All 22 templates defined as panel descriptor arrays.
// Coordinate convention: x=0 is shower center, positive x is right, positive z is toward viewer.
const TEMPLATE_PANELS: Record<ShowerTemplate, P[]> = {
  // ── Row 1: Straight ──────────────────────────────────────────────────────
  'single-door': [
    { xf: 0, zf: 0, wf: 1, rotY: 0, isDoor: true },
  ],
  'double-door': [
    { xf: -0.25, zf: 0, wf: 0.5, rotY: 0, isDoor: false },
    { xf:  0.25, zf: 0, wf: 0.5, rotY: 0, isDoor: true  },
  ],
  'fixed-small-door-large': [
    { xf: -0.35, zf: 0, wf: 0.3, rotY: 0, isDoor: false },
    { xf:  0.15, zf: 0, wf: 0.7, rotY: 0, isDoor: true  },
  ],
  'fixed-large-door-small': [
    { xf: -0.15, zf: 0, wf: 0.7, rotY: 0, isDoor: false },
    { xf:  0.35, zf: 0, wf: 0.3, rotY: 0, isDoor: true  },
  ],

  // ── Row 2: Return / L-shape ───────────────────────────────────────────────
  // Return panel: rotated 90°, sits at the left wall and extends into z
  'return-left-door': [
    { xf: -0.5,  zf: 0.2,  wf: 0.4, rotY: DEG90, isDoor: false },  // left return
    { xf:  0.1,  zf: 0,    wf: 0.8, rotY: 0,     isDoor: true  },  // front door
  ],
  'door-return-right': [
    { xf: -0.1,  zf: 0,    wf: 0.8, rotY: 0,     isDoor: true  },
    { xf:  0.5,  zf: 0.2,  wf: 0.4, rotY: DEG90, isDoor: false },
  ],
  'return-fixed-door': [
    { xf: -0.5,  zf: 0.2,  wf: 0.4, rotY: DEG90, isDoor: false },
    { xf: -0.15, zf: 0,    wf: 0.4, rotY: 0,     isDoor: false },
    { xf:  0.25, zf: 0,    wf: 0.4, rotY: 0,     isDoor: true  },
  ],
  'door-fixed-return': [
    { xf: -0.25, zf: 0,    wf: 0.4, rotY: 0,     isDoor: true  },
    { xf:  0.15, zf: 0,    wf: 0.4, rotY: 0,     isDoor: false },
    { xf:  0.5,  zf: 0.2,  wf: 0.4, rotY: DEG90, isDoor: false },
  ],

  // ── Row 3: 3-panel ────────────────────────────────────────────────────────
  // Step = a panel raised/lowered in z to suggest level difference
  '3p-return-door-step-left': [
    { xf: -0.5,  zf: 0.2,  wf: 0.4, rotY: DEG90, isDoor: false },
    { xf: -0.1,  zf: 0,    wf: 0.5, rotY: 0,     isDoor: true  },
    { xf:  0.3,  zf: 0.18, wf: 0.35,rotY: 0,     isDoor: false },
  ],
  '3p-return-door-step-right': [
    { xf: -0.3,  zf: 0.18, wf: 0.35,rotY: 0,     isDoor: false },
    { xf:  0.1,  zf: 0,    wf: 0.5, rotY: 0,     isDoor: true  },
    { xf:  0.5,  zf: 0.2,  wf: 0.4, rotY: DEG90, isDoor: false },
  ],
  '3p-fixed-door-fixed': [
    { xf: -0.33, zf: 0, wf: 0.33, rotY: 0, isDoor: false },
    { xf:  0,    zf: 0, wf: 0.33, rotY: 0, isDoor: true  },
    { xf:  0.33, zf: 0, wf: 0.33, rotY: 0, isDoor: false },
  ],
  '3p-door-fixed-fixed': [
    { xf: -0.33, zf: 0, wf: 0.33, rotY: 0, isDoor: true  },
    { xf:  0,    zf: 0, wf: 0.33, rotY: 0, isDoor: false },
    { xf:  0.33, zf: 0, wf: 0.33, rotY: 0, isDoor: false },
  ],

  // ── Row 4: Neo-angle 4-panel ──────────────────────────────────────────────
  // Angled panels at 45° connect front panels to side returns
  'neo4-left': [
    { xf: -0.5,   zf: 0.2,  wf: 0.4,  rotY: DEG90, isDoor: false },  // left return
    { xf: -0.32,  zf: 0.06, wf: 0.22, rotY: -DEG45, isDoor: false }, // left angle
    { xf:  0.1,   zf: 0,    wf: 0.55, rotY: 0,      isDoor: true  }, // front door
    { xf:  0.5,   zf: 0.2,  wf: 0.4,  rotY: DEG90,  isDoor: false }, // right return
  ],
  'neo4-right': [
    { xf: -0.5,   zf: 0.2,  wf: 0.4,  rotY: DEG90, isDoor: false },
    { xf: -0.1,   zf: 0,    wf: 0.55, rotY: 0,     isDoor: true  },
    { xf:  0.32,  zf: 0.06, wf: 0.22, rotY: DEG45, isDoor: false },
    { xf:  0.5,   zf: 0.2,  wf: 0.4,  rotY: DEG90, isDoor: false },
  ],
  'neo4-center-left': [
    { xf: -0.5,   zf: 0.25, wf: 0.5,  rotY: DEG90, isDoor: false },
    { xf: -0.22,  zf: 0,    wf: 0.4,  rotY: 0,     isDoor: true  },
    { xf:  0.15,  zf: 0.06, wf: 0.25, rotY: DEG45, isDoor: false },
    { xf:  0.5,   zf: 0.3,  wf: 0.4,  rotY: DEG90, isDoor: false },
  ],
  'neo4-center-right': [
    { xf: -0.5,   zf: 0.3,  wf: 0.4,  rotY: DEG90,  isDoor: false },
    { xf: -0.15,  zf: 0.06, wf: 0.25, rotY: -DEG45, isDoor: false },
    { xf:  0.22,  zf: 0,    wf: 0.4,  rotY: 0,      isDoor: true  },
    { xf:  0.5,   zf: 0.25, wf: 0.5,  rotY: DEG90,  isDoor: false },
  ],

  // ── Row 5: Curved / 5-panel ───────────────────────────────────────────────
  // 5-panel: two side returns + two 45° transitions + front door
  'curved5-left': [
    { xf: -0.5,   zf: 0.25, wf: 0.45, rotY: DEG90,  isDoor: false },
    { xf: -0.32,  zf: 0.07, wf: 0.22, rotY: -DEG45, isDoor: false },
    { xf:  0,     zf: 0,    wf: 0.3,  rotY: 0,      isDoor: true  },
    { xf:  0.22,  zf: 0.07, wf: 0.22, rotY: DEG45,  isDoor: false },
    { xf:  0.5,   zf: 0.25, wf: 0.45, rotY: DEG90,  isDoor: false },
  ],
  'curved5-right': [
    { xf: -0.5,   zf: 0.25, wf: 0.45, rotY: DEG90,  isDoor: false },
    { xf: -0.22,  zf: 0.07, wf: 0.22, rotY: -DEG45, isDoor: false },
    { xf:  0,     zf: 0,    wf: 0.3,  rotY: 0,      isDoor: true  },
    { xf:  0.32,  zf: 0.07, wf: 0.22, rotY: DEG45,  isDoor: false },
    { xf:  0.5,   zf: 0.25, wf: 0.45, rotY: DEG90,  isDoor: false },
  ],
  'curved4': [
    { xf: -0.5,   zf: 0.22, wf: 0.42, rotY: DEG90,  isDoor: false },
    { xf: -0.1,   zf: 0,    wf: 0.4,  rotY: 0,      isDoor: true  },
    { xf:  0.25,  zf: 0.06, wf: 0.22, rotY: DEG45,  isDoor: false },
    { xf:  0.5,   zf: 0.22, wf: 0.42, rotY: DEG90,  isDoor: false },
  ],
  'curved5-sym': [
    { xf: -0.5,   zf: 0.28, wf: 0.5,  rotY: DEG90,  isDoor: false },
    { xf: -0.3,   zf: 0.07, wf: 0.22, rotY: -DEG45, isDoor: false },
    { xf:  0,     zf: 0,    wf: 0.3,  rotY: 0,      isDoor: true  },
    { xf:  0.3,   zf: 0.07, wf: 0.22, rotY: DEG45,  isDoor: false },
    { xf:  0.5,   zf: 0.28, wf: 0.5,  rotY: DEG90,  isDoor: false },
  ],

  // ── Row 6: 6-panel wrap ───────────────────────────────────────────────────
  // 6-panel: two side returns + two 45° + two front panels (door + fixed)
  'wrap6-left': [
    { xf: -0.5,   zf: 0.3,  wf: 0.55, rotY: DEG90,  isDoor: false },
    { xf: -0.32,  zf: 0.09, wf: 0.22, rotY: -DEG45, isDoor: false },
    { xf: -0.05,  zf: 0,    wf: 0.25, rotY: 0,      isDoor: true  },
    { xf:  0.22,  zf: 0,    wf: 0.25, rotY: 0,      isDoor: false },
    { xf:  0.38,  zf: 0.09, wf: 0.22, rotY: DEG45,  isDoor: false },
    { xf:  0.5,   zf: 0.3,  wf: 0.55, rotY: DEG90,  isDoor: false },
  ],
  'wrap6-right': [
    { xf: -0.5,   zf: 0.3,  wf: 0.55, rotY: DEG90,  isDoor: false },
    { xf: -0.38,  zf: 0.09, wf: 0.22, rotY: -DEG45, isDoor: false },
    { xf: -0.22,  zf: 0,    wf: 0.25, rotY: 0,      isDoor: false },
    { xf:  0.05,  zf: 0,    wf: 0.25, rotY: 0,      isDoor: true  },
    { xf:  0.32,  zf: 0.09, wf: 0.22, rotY: DEG45,  isDoor: false },
    { xf:  0.5,   zf: 0.3,  wf: 0.55, rotY: DEG90,  isDoor: false },
  ],
};

export default function ShowerPreview3D({ state }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameRef = useRef<number>(0);
  const meshesRef = useRef<THREE.Mesh[]>([]);

  const w = (state.width || 36) / 12;
  const h = (state.height || 78) / 12;
  const DEPTH = 0.05;

  const glassHex = GLASS_HEX[state.glassType ?? 'clear'] ?? GLASS_HEX.clear;
  const metalHex = FINISH_HEX[state.hardwareFinish ?? 'chrome'] ?? FINISH_HEX.chrome;
  const template = state.template ?? 'single-door';

  const buildScene = useCallback(() => {
    const scene = sceneRef.current;
    if (scene == null) return;

    meshesRef.current.forEach(m => {
      scene.remove(m);
      m.geometry.dispose();
      (Array.isArray(m.material) ? m.material : [m.material]).forEach(mat => mat.dispose());
    });
    meshesRef.current = [];

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: glassHex,
      transparent: true,
      opacity: 0.45,
      roughness: 0.05,
      metalness: 0,
      transmission: 0.75,
      thickness: 0.05,
      side: THREE.DoubleSide,
    });

    const metalMat = new THREE.MeshStandardMaterial({
      color: metalHex,
      roughness: state.hardwareFinish === 'matte-black' ? 0.85 : 0.25,
      metalness: state.hardwareFinish === 'matte-black' ? 0.2 : 0.95,
    });

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.8 });

    const s = scene!;
    function add(mesh: THREE.Mesh) {
      s.add(mesh);
      meshesRef.current.push(mesh);
    }

    // Walls
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, h + 0.08, 0.15), wallMat);
    leftWall.position.set(-w / 2 - 0.04, h / 2, 0);
    add(leftWall);

    const bottomWall = new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, 0.08, 0.15), wallMat);
    bottomWall.position.set(0, -0.04, 0);
    add(bottomWall);

    // Glass panels from template descriptor
    const panels = TEMPLATE_PANELS[template] ?? TEMPLATE_PANELS['single-door'];

    panels.forEach(p => {
      const pw = p.wf * w;
      const geo = new THREE.BoxGeometry(pw, h, DEPTH);
      const mesh = new THREE.Mesh(geo, glassMat);
      mesh.position.set(p.xf * w, h / 2, p.zf * w);
      mesh.rotation.y = p.rotY;
      add(mesh);

      // Handle on door panels
      if (p.isDoor && state.handleStyle !== 'none') {
        // Compute handle world-space offset based on panel rotation
        const handleOffset = new THREE.Vector3(pw / 2 - 0.12, 0, DEPTH / 2 + 0.07);
        handleOffset.applyEuler(new THREE.Euler(0, p.rotY, 0));
        const handleLen = state.handleStyle === 'towel-bar' ? 0.5 : 0.35;
        const handleGeo = new THREE.CylinderGeometry(0.025, 0.025, handleLen, 12);
        const handle = new THREE.Mesh(handleGeo, metalMat);
        handle.position.set(
          p.xf * w + handleOffset.x,
          h / 2,
          p.zf * w + handleOffset.z,
        );
        handle.rotation.y = p.rotY;
        add(handle);
      }

      // Hinges on each panel
      if (!p.isDoor || state.handleStyle !== 'none') {
        [-0.2, 0.2].forEach(yOff => {
          const hingeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.1, 12);
          const hinge = new THREE.Mesh(hingeGeo, metalMat);
          const edgeOffset = new THREE.Vector3(-pw / 2 + 0.05, 0, DEPTH / 2 + 0.03);
          edgeOffset.applyEuler(new THREE.Euler(0, p.rotY, 0));
          hinge.position.set(
            p.xf * w + edgeOffset.x,
            h / 2 + yOff * h,
            p.zf * w + edgeOffset.z,
          );
          hinge.rotation.set(Math.PI / 2, 0, p.rotY);
          add(hinge);
        });
      }
    });
  }, [glassHex, metalHex, template, w, h, state.handleStyle, state.hardwareFinish]);

  // Init Three.js once
  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const width = el.clientWidth || 400;
    const height = el.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3, 3.5, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.domElement.setAttribute('data-engine', 'three.js');
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1.5;
    controls.maxDistance = 14;
    // Keep the camera on a vertical (front-on) viewing band — no top-down view.
    controls.minPolarAngle = Math.PI / 4;       // 45° — can't tilt to look from above
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // just past level — can't dip below the floor
    controls.target.set(0, 2, 0);
    controls.update();
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(5, 8, 5);
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0xd0eeff, 0.4);
    fill.position.set(-5, 3, -3);
    scene.add(fill);

    const grid = new THREE.GridHelper(10, 20, 0xd1d5db, 0xe5e7eb);
    grid.position.y = -0.04;
    scene.add(grid);

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => { buildScene(); }, [buildScene]);

  function resetCamera() {
    cameraRef.current?.position.set(3, 3.5, 5);
    controlsRef.current?.target.set(0, 2, 0);
    controlsRef.current?.update();
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div ref={mountRef} className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner" style={{ height: 320 }} />
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>🖱 Drag to rotate · Scroll to zoom</span>
        <button type="button" onClick={resetCamera} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
          Reset View
        </button>
      </div>
    </div>
  );
}
