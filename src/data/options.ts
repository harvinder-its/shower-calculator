import { GlassType, GlassThickness, HardwareFinish, HandleStyle, HingeType, EnclosureType, InstallType, ShowerTemplate } from '@/types';

// ─── Front-elevation SVG helpers ───────────────────────────────────────────
// Vertical view (looking straight at the enclosure): X = position along the
// opening, Y = height off the floor. Canvas: 80 × 100. Header track at
// y=10, floor at y=90, opening runs from x=10 to x=70.

const G = '#7bbcb0';  // fixed-panel glass teal
const W = '#9ca3af';  // header / floor track gray
const D = '#c8956b';  // door panel color
const SW = 2;         // stroke-width between panels
const WW = 4;         // stroke-width header/floor track
const TOP = 10;
const BOTTOM = 90;

function svg(content: string) {
  return `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" width="80" height="100">${content}</svg>`;
}

// Header track (top) and floor line (bottom)
function tracks(lx = 10, rx = 70) {
  return `
    <line x1="${lx}" y1="${TOP}" x2="${rx}" y2="${TOP}" stroke="${W}" stroke-width="${WW}" stroke-linecap="round"/>
    <line x1="${lx}" y1="${BOTTOM}" x2="${rx}" y2="${BOTTOM}" stroke="${W}" stroke-width="${WW}" stroke-linecap="round"/>
  `;
}

// A glass panel seen face-on, spanning the full height
function panel(x1: number, x2: number, isDoor = false) {
  const color = isDoor ? D : G;
  const mid = (TOP + BOTTOM) / 2;
  const handle = isDoor
    ? `<line x1="${x2 - 4}" y1="${mid - 7}" x2="${x2 - 4}" y2="${mid + 7}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`
    : '';
  return `<rect x="${x1}" y="${TOP}" width="${x2 - x1}" height="${BOTTOM - TOP}" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="${SW}"/>${handle}`;
}

// A side-return panel seen edge-on: a thin strip flush with the wall
function ret(atLeft: boolean) {
  const x = atLeft ? 10 : 66;
  return `<rect x="${x}" y="${TOP}" width="4" height="${BOTTOM - TOP}" fill="${G}" fill-opacity="0.35" stroke="${G}" stroke-width="${SW}"/>`;
}

type Seg =
  | { kind: 'door'; x1: number; x2: number }
  | { kind: 'fixed'; x1: number; x2: number }
  | { kind: 'retL' }
  | { kind: 'retR' };

function renderSeg(s: Seg): string {
  if (s.kind === 'retL') return ret(true);
  if (s.kind === 'retR') return ret(false);
  return panel(s.x1, s.x2, s.kind === 'door');
}

function render(segs: Seg[]) {
  return svg(tracks() + segs.map(renderSeg).join(''));
}

// Mirrors a segment layout left-to-right (used to derive the "-right" twin of a "-left" template)
function mirror(segs: Seg[]): Seg[] {
  return segs.map((s): Seg => {
    if (s.kind === 'retL') return { kind: 'retR' };
    if (s.kind === 'retR') return { kind: 'retL' };
    return { kind: s.kind, x1: 80 - s.x2, x2: 80 - s.x1 };
  });
}

// ─── 22 Template front-elevation SVGs ──────────────────────────────────────

const returnLeftDoor: Seg[] = [{ kind: 'retL' }, { kind: 'door', x1: 14, x2: 70 }];
const returnFixedDoor: Seg[] = [{ kind: 'retL' }, { kind: 'fixed', x1: 14, x2: 40 }, { kind: 'door', x1: 40, x2: 70 }];
const p3ReturnDoorStepLeft: Seg[] = [{ kind: 'retL' }, { kind: 'door', x1: 14, x2: 45 }, { kind: 'fixed', x1: 45, x2: 70 }];
const neo4Left: Seg[] = [{ kind: 'retL' }, { kind: 'fixed', x1: 14, x2: 26 }, { kind: 'door', x1: 26, x2: 66 }, { kind: 'retR' }];
const neo4CenterLeft: Seg[] = [{ kind: 'retL' }, { kind: 'door', x1: 14, x2: 44 }, { kind: 'fixed', x1: 44, x2: 66 }, { kind: 'retR' }];
const curved5Left: Seg[] = [{ kind: 'retL' }, { kind: 'fixed', x1: 14, x2: 26 }, { kind: 'door', x1: 26, x2: 50 }, { kind: 'fixed', x1: 50, x2: 66 }, { kind: 'retR' }];
const wrap6Left: Seg[] = [{ kind: 'retL' }, { kind: 'fixed', x1: 14, x2: 27 }, { kind: 'door', x1: 27, x2: 42 }, { kind: 'fixed', x1: 42, x2: 53 }, { kind: 'fixed', x1: 53, x2: 66 }, { kind: 'retR' }];

const ELEVATIONS: Record<ShowerTemplate, string> = {
  // Row 1 – straight
  'single-door': render([{ kind: 'door', x1: 10, x2: 70 }]),
  'double-door': render([{ kind: 'fixed', x1: 10, x2: 40 }, { kind: 'door', x1: 40, x2: 70 }]),
  'fixed-small-door-large': render([{ kind: 'fixed', x1: 10, x2: 24 }, { kind: 'door', x1: 24, x2: 70 }]),
  'fixed-large-door-small': render([{ kind: 'fixed', x1: 10, x2: 52 }, { kind: 'door', x1: 52, x2: 70 }]),

  // Row 2 – return / L-shape
  'return-left-door': render(returnLeftDoor),
  'door-return-right': render(mirror(returnLeftDoor)),
  'return-fixed-door': render(returnFixedDoor),
  'door-fixed-return': render(mirror(returnFixedDoor)),

  // Row 3 – 3-panel
  '3p-return-door-step-left': render(p3ReturnDoorStepLeft),
  '3p-return-door-step-right': render(mirror(p3ReturnDoorStepLeft)),
  '3p-fixed-door-fixed': render([{ kind: 'fixed', x1: 10, x2: 30 }, { kind: 'door', x1: 30, x2: 50 }, { kind: 'fixed', x1: 50, x2: 70 }]),
  '3p-door-fixed-fixed': render([{ kind: 'door', x1: 10, x2: 30 }, { kind: 'fixed', x1: 30, x2: 50 }, { kind: 'fixed', x1: 50, x2: 70 }]),

  // Row 4 – neo-angle 4-panel
  'neo4-left': render(neo4Left),
  'neo4-right': render(mirror(neo4Left)),
  'neo4-center-left': render(neo4CenterLeft),
  'neo4-center-right': render(mirror(neo4CenterLeft)),

  // Row 5 – curved/5-panel
  'curved5-left': render(curved5Left),
  'curved5-right': render(mirror(curved5Left)),
  'curved4': render([{ kind: 'retL' }, { kind: 'door', x1: 14, x2: 40 }, { kind: 'fixed', x1: 40, x2: 66 }, { kind: 'retR' }]),
  'curved5-sym': render([{ kind: 'retL' }, { kind: 'fixed', x1: 14, x2: 28 }, { kind: 'door', x1: 28, x2: 52 }, { kind: 'fixed', x1: 52, x2: 66 }, { kind: 'retR' }]),

  // Row 6 – 6-panel wrap
  'wrap6-left': render(wrap6Left),
  'wrap6-right': render(mirror(wrap6Left)),
};

// ─── Template metadata ────────────────────────────────────────────────────

export const TEMPLATES: { id: ShowerTemplate; label: string; description: string; elevationSvg: string }[] = [
  { id: 'single-door',           label: 'Single Door',           description: '1 pivot door',                   elevationSvg: ELEVATIONS['single-door'] },
  { id: 'double-door',           label: 'Double Door',           description: '2 equal swing doors',            elevationSvg: ELEVATIONS['double-door'] },
  { id: 'fixed-small-door-large',label: 'Fixed + Wide Door',     description: 'Narrow fixed, wide door',        elevationSvg: ELEVATIONS['fixed-small-door-large'] },
  { id: 'fixed-large-door-small',label: 'Wide Fixed + Door',     description: 'Wide fixed, narrow door',        elevationSvg: ELEVATIONS['fixed-large-door-small'] },
  { id: 'return-left-door',      label: 'Return Left + Door',    description: 'Side return on left',            elevationSvg: ELEVATIONS['return-left-door'] },
  { id: 'door-return-right',     label: 'Door + Return Right',   description: 'Side return on right',           elevationSvg: ELEVATIONS['door-return-right'] },
  { id: 'return-fixed-door',     label: 'Return + Fixed + Door', description: 'Return, fixed, then door',       elevationSvg: ELEVATIONS['return-fixed-door'] },
  { id: 'door-fixed-return',     label: 'Door + Fixed + Return', description: 'Door, fixed, then return',       elevationSvg: ELEVATIONS['door-fixed-return'] },
  { id: '3p-return-door-step-left',  label: '3-Panel Step Left',    description: 'Return + door + step',        elevationSvg: ELEVATIONS['3p-return-door-step-left'] },
  { id: '3p-return-door-step-right', label: '3-Panel Step Right',   description: 'Step + door + return',        elevationSvg: ELEVATIONS['3p-return-door-step-right'] },
  { id: '3p-fixed-door-fixed',   label: '3-Panel Center Door',   description: 'Fixed / door / fixed',           elevationSvg: ELEVATIONS['3p-fixed-door-fixed'] },
  { id: '3p-door-fixed-fixed',   label: '3-Panel Left Door',     description: 'Door + 2 fixed panels',          elevationSvg: ELEVATIONS['3p-door-fixed-fixed'] },
  { id: 'neo4-left',             label: 'Neo-Angle Left',        description: '4-panel, angled left entry',     elevationSvg: ELEVATIONS['neo4-left'] },
  { id: 'neo4-right',            label: 'Neo-Angle Right',       description: '4-panel, angled right entry',    elevationSvg: ELEVATIONS['neo4-right'] },
  { id: 'neo4-center-left',      label: 'Neo-Angle Ctr-Left',    description: '4-panel, center-left entry',     elevationSvg: ELEVATIONS['neo4-center-left'] },
  { id: 'neo4-center-right',     label: 'Neo-Angle Ctr-Right',   description: '4-panel, center-right entry',    elevationSvg: ELEVATIONS['neo4-center-right'] },
  { id: 'curved5-left',          label: 'Curved 5-Panel Left',   description: '5-panel curved, left entry',     elevationSvg: ELEVATIONS['curved5-left'] },
  { id: 'curved5-right',         label: 'Curved 5-Panel Right',  description: '5-panel curved, right entry',    elevationSvg: ELEVATIONS['curved5-right'] },
  { id: 'curved4',               label: 'Curved 4-Panel',        description: '4-panel curved entry',           elevationSvg: ELEVATIONS['curved4'] },
  { id: 'curved5-sym',           label: 'Curved 5-Panel Sym',    description: '5-panel symmetric curved',       elevationSvg: ELEVATIONS['curved5-sym'] },
  { id: 'wrap6-left',            label: '6-Panel Wrap Left',     description: '6-panel full wrap, left door',   elevationSvg: ELEVATIONS['wrap6-left'] },
  { id: 'wrap6-right',           label: '6-Panel Wrap Right',    description: '6-panel full wrap, right door',  elevationSvg: ELEVATIONS['wrap6-right'] },
];

// ─── Other option arrays ───────────────────────────────────────────────────

export const ENCLOSURE_TYPES: { id: EnclosureType; label: string; description: string }[] = [
  { id: 'frameless',      label: 'Frameless',      description: 'No metal frame, clean modern look' },
  { id: 'semi-frameless', label: 'Semi-Frameless', description: 'Minimal framing on edges only' },
  { id: 'framed',         label: 'Framed',          description: 'Full metal frame around glass' },
];

export const INSTALL_TYPES: { id: InstallType; label: string; description: string }[] = [
  { id: 'alcove',  label: 'Alcove',   description: 'Three walls, one open side' },
  { id: 'corner',  label: 'Corner',   description: 'Two walls, two open sides' },
  { id: 'walk-in', label: 'Walk-In',  description: 'Open entry, no door required' },
  { id: 'custom',  label: 'Custom',   description: 'Non-standard configuration' },
];

export const GLASS_TYPES: { id: GlassType; label: string; description: string; priceMin: number; priceMax: number }[] = [
  { id: 'clear',         label: 'Clear',       description: 'Standard clear tempered glass',    priceMin: 45, priceMax: 55 },
  { id: 'low-iron',      label: 'Low Iron',    description: 'Ultra-clear, no green tint',        priceMin: 55, priceMax: 70 },
  { id: 'shower-guard',  label: 'ShowerGuard', description: 'Permanent easy-clean coating',      priceMin: 65, priceMax: 85 },
];

export const GLASS_THICKNESSES: { id: GlassThickness; label: string; description: string }[] = [
  { id: '3/8"', label: '3/8"', description: 'Standard weight, cost-effective' },
  { id: '1/2"', label: '1/2"', description: 'Premium weight, added stability' },
];

export const HARDWARE_FINISHES: { id: HardwareFinish; label: string; hex: string }[] = [
  { id: 'chrome',            label: 'Chrome',           hex: '#c0c0c0' },
  { id: 'brushed-nickel',    label: 'Brushed Nickel',   hex: '#8d8d8d' },
  { id: 'matte-black',       label: 'Matte Black',      hex: '#2d2d2d' },
  { id: 'oil-rubbed-bronze', label: 'Oil-Rubbed Bronze',hex: '#6b3e2a' },
];

export const HANDLE_STYLES: { id: HandleStyle; label: string; description: string }[] = [
  { id: 'c-pull',    label: 'C-Pull',    description: 'Classic curved pull handle' },
  { id: 'towel-bar', label: 'Towel Bar', description: 'Dual-purpose towel & handle' },
  { id: 'd-pull',    label: 'D-Pull',    description: 'Modern D-shaped handle' },
  { id: 'none',      label: 'None',      description: 'No handle / notch entry' },
];

export const HINGE_TYPES: { id: HingeType; label: string; description: string }[] = [
  { id: 'standard',   label: 'Standard',   description: 'Wall-mount butt hinge' },
  { id: 'heavy-duty', label: 'Heavy Duty', description: 'For thicker / heavier glass' },
  { id: 'pivot',      label: 'Pivot',      description: 'Top & bottom pivot points' },
];
