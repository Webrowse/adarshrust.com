export interface Theme {
  id: string;
  name: string;
  description: string;
  bgSide: string;
  bgCenter: string;
  bgCard: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderSoft: string;
  borderStrong: string;
  gearBase: string;
  gearHighlight: string;
  gearShadow: string;
  accent1: string;
  accent2: string;
  sceneBackground: string;
  sceneFog: string;
  lightAmbient: string;
  lightKey: string;
  lightForge: string;
  lightCool: string;
  sparkColor: string;
  gearStyle: '3d' | 'svg-sunflower' | 'svg-mecha';
  borderStyle: 'clean' | 'wobble' | 'sharp';
  useHalftone: boolean;
  showEmbers: boolean;
  lightIntensity: {
    ambient: number;
    key: number;
    forge: number;
    cool: number;
    envMap: number;
  };
}

export const THEMES: Record<string, Theme> = {
  workshop: {
    id: 'workshop',
    name: 'Workshop',
    description: 'Bright sunlit, playful, the daylight default',
    bgSide: '#4f4944',
    bgCenter: '#f8f3e6',
    bgCard: '#fffaee',
    textPrimary: '#2a241e',
    textSecondary: '#665849',
    textMuted: '#a87830',
    borderSoft: '#e6b048',
    borderStrong: '#c89a30',
    gearBase: '#e6b048',
    gearHighlight: '#f5d088',
    gearShadow: '#5a3f12',
    accent1: '#80b8d8',
    accent2: '#f5a878',
    sceneBackground: '#4f4944',
    sceneFog: '#4f4944',
    lightAmbient: '#fff4d8',
    lightKey: '#ffefb8',
    lightForge: '#f5d088',
    lightCool: '#cdd4dc',
    sparkColor: '#f5d088',
    gearStyle: '3d',
    borderStyle: 'clean',
    useHalftone: false,
    showEmbers: false,
    lightIntensity: {
      ambient: 0.45,
      key: 1.6,
      forge: 2.2,
      cool: 0.45,
      envMap: 1.4,
    },
  },
};

export const DEFAULT_THEME_ID = 'workshop';
