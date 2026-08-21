import { GlassType, GlassThickness, HardwareFinish, HandleStyle, HingeType, EnclosureType, InstallType, ShowerTemplate } from '@/types';

// ─── Floor-plan SVG helpers ────────────────────────────────────────────────
// Top-down view: X = horizontal, Y = depth into shower
// Canvas: 100 × 80.  Front glass line at y=20, back wall at y=70, sides at x=5 & x=95

const G = '#7bbcb0';  // glass teal
const W = '#9ca3af';  // wall gray
const D = '#c8956b';  // door arc color
const SW = 3;         // stroke-width glass
const WW = 5;         // stroke-width wall

function svg(content: string) {
  return `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" width="100" height="80">${content}</svg>`;
}

// Horizontal glass panel line at depth y, from x1 to x2
function hpanel(x1: number, x2: number, y: number, isDoor = false) {
  const color = isDoor ? D : G;
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="${SW}"/>`;
}

// Vertical (side-return) glass panel from y1 to y2 at x
function vpanel(x: number, y1: number, y2: number, isDoor = false) {
  const color = isDoor ? D : G;
  return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${color}" stroke-width="${SW}"/>`;
}

// Angled panel from (x1,y1) to (x2,y2)
function apanel(x1: number, y1: number, x2: number, y2: number, isDoor = false) {
  const color = isDoor ? D : G;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${SW}"/>`;
}

// Left wall, right wall, back wall
function walls(lx = 5, rx = 95, fy = 20, by = 70) {
  return `
    <line x1="${lx}" y1="${fy}" x2="${lx}" y2="${by}" stroke="${W}" stroke-width="${WW}" stroke-linecap="round"/>
    <line x1="${rx}" y1="${fy}" x2="${rx}" y2="${by}" stroke="${W}" stroke-width="${WW}" stroke-linecap="round"/>
    <line x1="${lx}" y1="${by}" x2="${rx}" y2="${by}" stroke="${W}" stroke-width="${WW}" stroke-linecap="round"/>
  `;
}

// ─── 22 Template floor-plan SVGs ──────────────────────────────────────────

const PLANS: Record<ShowerTemplate, string> = {
  // Row 1 – straight
  'single-door': svg(walls() + hpanel(5, 95, 20, true)),
  'double-door': svg(walls() + hpanel(5, 50, 20, false) + hpanel(50, 95, 20, true)),
  'fixed-small-door-large': svg(walls() + hpanel(5, 35, 20, false) + hpanel(35, 95, 20, true)),
  'fixed-large-door-small': svg(walls() + hpanel(5, 65, 20, false) + hpanel(65, 95, 20, true)),

  // Row 2 – return / L-shape
  'return-left-door': svg(walls() + vpanel(5, 20, 60) + hpanel(5, 95, 20, true)),
  'door-return-right': svg(walls() + hpanel(5, 95, 20, true) + vpanel(95, 20, 60)),
  'return-fixed-door': svg(walls() + vpanel(5, 20, 55) + hpanel(5, 55, 20) + hpanel(55, 95, 20, true)),
  'door-fixed-return': svg(walls() + hpanel(5, 45, 20, true) + hpanel(45, 95, 20) + vpanel(95, 20, 55)),

  // Row 3 – 3-panel
  '3p-return-door-step-left': svg(walls() + vpanel(5, 20, 60) + hpanel(5, 55, 20, true) + hpanel(55, 95, 40)),
  '3p-return-door-step-right': svg(walls() + hpanel(5, 45, 40) + hpanel(45, 95, 20, true) + vpanel(95, 20, 60)),
  '3p-fixed-door-fixed': svg(walls() + hpanel(5, 35, 20) + hpanel(35, 65, 20, true) + hpanel(65, 95, 20)),
  '3p-door-fixed-fixed': svg(walls() + hpanel(5, 45, 20, true) + hpanel(45, 70, 20) + hpanel(70, 95, 20)),

  // Row 4 – neo-angle 4-panel
  'neo4-left': svg(walls() + vpanel(5, 20, 50) + apanel(5, 20, 30, 20) + hpanel(30, 95, 20, true) + vpanel(95, 20, 70)),
  'neo4-right': svg(walls() + vpanel(5, 20, 70) + hpanel(5, 70, 20, true) + apanel(70, 20, 95, 20) + vpanel(95, 20, 50)),
  'neo4-center-left': svg(walls() + vpanel(5, 20, 65) + hpanel(5, 50, 20, true) + apanel(50, 20, 95, 50) + vpanel(95, 50, 70)),
  'neo4-center-right': svg(walls() + vpanel(5, 50, 70) + apanel(5, 20, 50, 50) + hpanel(50, 95, 20, true) + vpanel(95, 20, 65)),

  // Row 5 – curved/5-panel
  'curved5-left': svg(walls() + vpanel(5, 20, 65) + apanel(5, 20, 28, 20) + hpanel(28, 60, 20, true) + apanel(60, 20, 80, 30) + vpanel(95, 30, 65)),
  'curved5-right': svg(walls() + vpanel(5, 30, 65) + apanel(5, 20, 40, 30) + hpanel(40, 72, 20, true) + apanel(72, 20, 95, 20) + vpanel(95, 20, 65)),
  'curved4': svg(walls() + vpanel(5, 20, 65) + apanel(5, 20, 40, 20) + hpanel(40, 60, 20, true) + apanel(60, 20, 95, 20) + vpanel(95, 20, 65)),
  'curved5-sym': svg(walls() + vpanel(5, 25, 65) + apanel(5, 20, 30, 25) + hpanel(30, 70, 20, true) + apanel(70, 20, 95, 25) + vpanel(95, 25, 65)),

  // Row 6 – 6-panel wrap
  'wrap6-left': svg(walls() + vpanel(5, 20, 65) + apanel(5, 20, 22, 20) + hpanel(22, 50, 20, true) + hpanel(50, 78, 20) + apanel(78, 20, 95, 30) + vpanel(95, 30, 65)),
  'wrap6-right': svg(walls() + vpanel(5, 30, 65) + apanel(5, 20, 22, 30) + hpanel(22, 50, 20) + hpanel(50, 78, 20, true) + apanel(78, 20, 95, 20) + vpanel(95, 20, 65)),
};

// ─── Template metadata ────────────────────────────────────────────────────

export const TEMPLATES: { id: ShowerTemplate; label: string; description: string; planSvg: string }[] = [
  { id: 'single-door',           label: 'Single Door',           description: '1 pivot door',                   planSvg: PLANS['single-door'] },
  { id: 'double-door',           label: 'Double Door',           description: '2 equal swing doors',            planSvg: PLANS['double-door'] },
  { id: 'fixed-small-door-large',label: 'Fixed + Wide Door',     description: 'Narrow fixed, wide door',        planSvg: PLANS['fixed-small-door-large'] },
  { id: 'fixed-large-door-small',label: 'Wide Fixed + Door',     description: 'Wide fixed, narrow door',        planSvg: PLANS['fixed-large-door-small'] },
  { id: 'return-left-door',      label: 'Return Left + Door',    description: 'Side return on left',            planSvg: PLANS['return-left-door'] },
  { id: 'door-return-right',     label: 'Door + Return Right',   description: 'Side return on right',           planSvg: PLANS['door-return-right'] },
  { id: 'return-fixed-door',     label: 'Return + Fixed + Door', description: 'Return, fixed, then door',       planSvg: PLANS['return-fixed-door'] },
  { id: 'door-fixed-return',     label: 'Door + Fixed + Return', description: 'Door, fixed, then return',       planSvg: PLANS['door-fixed-return'] },
  { id: '3p-return-door-step-left',  label: '3-Panel Step Left',    description: 'Return + door + step',        planSvg: PLANS['3p-return-door-step-left'] },
  { id: '3p-return-door-step-right', label: '3-Panel Step Right',   description: 'Step + door + return',        planSvg: PLANS['3p-return-door-step-right'] },
  { id: '3p-fixed-door-fixed',   label: '3-Panel Center Door',   description: 'Fixed / door / fixed',           planSvg: PLANS['3p-fixed-door-fixed'] },
  { id: '3p-door-fixed-fixed',   label: '3-Panel Left Door',     description: 'Door + 2 fixed panels',          planSvg: PLANS['3p-door-fixed-fixed'] },
  { id: 'neo4-left',             label: 'Neo-Angle Left',        description: '4-panel, angled left entry',     planSvg: PLANS['neo4-left'] },
  { id: 'neo4-right',            label: 'Neo-Angle Right',       description: '4-panel, angled right entry',    planSvg: PLANS['neo4-right'] },
  { id: 'neo4-center-left',      label: 'Neo-Angle Ctr-Left',    description: '4-panel, center-left entry',     planSvg: PLANS['neo4-center-left'] },
  { id: 'neo4-center-right',     label: 'Neo-Angle Ctr-Right',   description: '4-panel, center-right entry',    planSvg: PLANS['neo4-center-right'] },
  { id: 'curved5-left',          label: 'Curved 5-Panel Left',   description: '5-panel curved, left entry',     planSvg: PLANS['curved5-left'] },
  { id: 'curved5-right',         label: 'Curved 5-Panel Right',  description: '5-panel curved, right entry',    planSvg: PLANS['curved5-right'] },
  { id: 'curved4',               label: 'Curved 4-Panel',        description: '4-panel curved entry',           planSvg: PLANS['curved4'] },
  { id: 'curved5-sym',           label: 'Curved 5-Panel Sym',    description: '5-panel symmetric curved',       planSvg: PLANS['curved5-sym'] },
  { id: 'wrap6-left',            label: '6-Panel Wrap Left',     description: '6-panel full wrap, left door',   planSvg: PLANS['wrap6-left'] },
  { id: 'wrap6-right',           label: '6-Panel Wrap Right',    description: '6-panel full wrap, right door',  planSvg: PLANS['wrap6-right'] },
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
