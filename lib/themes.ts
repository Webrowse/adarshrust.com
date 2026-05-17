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

  verdigris: {
    id: 'verdigris',
    name: 'Verdigris',
    description: 'Cool coastal patina, slate and copper',
    bgSide: '#2d343a',
    bgCenter: '#ece5d8',
    bgCard: '#f4eddf',
    textPrimary: '#1d2530',
    textSecondary: '#4a4d3a',
    textMuted: '#7a8088',
    borderSoft: '#a8987c',
    borderStrong: '#8a8268',
    gearBase: '#b87a4a',
    gearHighlight: '#d4985a',
    gearShadow: '#3a1f10',
    accent1: '#7a9a8a',
    accent2: '#c0867a',
    sceneBackground: '#2d343a',
    sceneFog: '#2d343a',
    lightAmbient: '#e8e0d0',
    lightKey: '#f0e0c8',
    lightForge: '#d4985a',
    lightCool: '#a8b8c0',
    sparkColor: '#d4985a',
    gearStyle: '3d',
    borderStyle: 'clean',
    useHalftone: false,
    showEmbers: false,
    lightIntensity: {
      ambient: 0.42,
      key: 1.4,
      forge: 2.0,
      cool: 0.55,
      envMap: 1.5,
    },
  },
};

export const DEFAULT_THEME_ID = 'workshop';
