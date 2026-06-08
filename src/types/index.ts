export type GlassType = 'clear' | 'low-iron' | 'shower-guard';
export type GlassThickness = '3/8"' | '1/2"';
export type HardwareFinish = 'chrome' | 'brushed-nickel' | 'matte-black' | 'oil-rubbed-bronze';
export type HandleStyle = 'c-pull' | 'towel-bar' | 'd-pull' | 'none';
export type HingeType = 'standard' | 'heavy-duty' | 'pivot';
export type EnclosureType = 'frameless' | 'semi-frameless' | 'framed';
export type InstallType = 'alcove' | 'corner' | 'walk-in' | 'custom';

export type ShowerTemplate =
  // Row 1 – Straight 1-2 panel
  | 'single-door'
  | 'double-door'
  | 'fixed-small-door-large'
  | 'fixed-large-door-small'
  // Row 2 – Return / L-shape
  | 'return-left-door'
  | 'door-return-right'
  | 'return-fixed-door'
  | 'door-fixed-return'
  // Row 3 – 3-panel
  | '3p-return-door-step-left'
  | '3p-return-door-step-right'
  | '3p-fixed-door-fixed'
  | '3p-door-fixed-fixed'
  // Row 4 – Neo-angle 4-panel
  | 'neo4-left'
  | 'neo4-right'
  | 'neo4-center-left'
  | 'neo4-center-right'
  // Row 5 – Curved / 5-panel
  | 'curved5-left'
  | 'curved5-right'
  | 'curved4'
  | 'curved5-sym'
  // Row 6 – 6-panel wrap
  | 'wrap6-left'
  | 'wrap6-right';

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  zip: string;
  notes: string;
}

export interface QuoteState {
  template: ShowerTemplate | null;
  enclosureType: EnclosureType | null;
  installType: InstallType | null;
  width: number;
  height: number;
  glassType: GlassType | null;
  glassThickness: GlassThickness | null;
  hardwareFinish: HardwareFinish | null;
  handleStyle: HandleStyle | null;
  hingeType: HingeType | null;
  contact: ContactInfo;
}

export type Step = 1 | 2 | 3 | 4;
