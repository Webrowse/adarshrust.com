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
  gearStyle: '3d' | 'svg-sunflower' | 'svg-ghibli' | 'svg-mecha';
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

// TODO: Future themes with unique assets (Sunflower SVGs, Cel halftone patterns,
// custom fonts) will need a prefetch step in app/page.tsx after first paint.

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

  sunflower: {
    id: 'sunflower',
    name: 'Sunflower',
    description: 'Bright, chunky, kids-show energy',
    bgSide: '#80ccf0',
    bgCenter: '#ffffff',
    bgCard: '#ffffff',
    textPrimary: '#1a3a52',
    textSecondary: '#3a5a72',
    textMuted: '#5a7a92',
    borderSoft: '#1cb0f6',
    borderStrong: '#0a90d6',
    gearBase: '#ffd02f',
    gearHighlight: '#ffe066',
    gearShadow: '#6a4825',
    accent1: '#ff5d5d',
    accent2: '#5dca3e',
    sceneBackground: '#80ccf0',
    sceneFog: '#80ccf0',
    lightAmbient: '#ffffff',
    lightKey: '#fffae8',
    lightForge: '#ffd02f',
    lightCool: '#cde8f5',
    sparkColor: '#ffd02f',
    gearStyle: 'svg-sunflower',
    borderStyle: 'wobble',
    useHalftone: false,
    showEmbers: false,
    lightIntensity: {
      ambient: 0.6,
      key: 0.7,
      forge: 0,
      cool: 0.4,
      envMap: 1.0,
    },
  },

  ghibli: {
    id: 'ghibli',
    name: 'Ghibli',
    description: 'Windswept meadow, pastoral and dreamy',
    bgSide: '#a8d8e8',
    bgCenter: '#fef7ea',
    bgCard: '#fffdf7',
    textPrimary: '#2c3e2d',
    textSecondary: '#4d6050',
    textMuted: '#7a9878',
    borderSoft: '#b8d4a8',
    borderStrong: '#88b880',
    gearBase: '#88b880',
    gearHighlight: '#bce0a0',
    gearShadow: '#3d5a30',
    accent1: '#f5c030',
    accent2: '#e890b8',
    sceneBackground: '#a8d8e8',
    sceneFog: '#a8d8e8',
    lightAmbient: '#f0f8ff',
    lightKey: '#fffae8',
    lightForge: '#88b880',
    lightCool: '#c8e8f8',
    sparkColor: '#fafaf5',
    gearStyle: 'svg-ghibli',
    borderStyle: 'clean',
    useHalftone: false,
    showEmbers: false,
    lightIntensity: {
      ambient: 0.7,
      key: 0.6,
      forge: 0,
      cool: 0.5,
      envMap: 1.0,
    },
  },
};

export const DEFAULT_THEME_ID = 'ghibli';
