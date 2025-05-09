/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

type ThemeColors = {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
};

type ColorScale = {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

type GrayScale = {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  primary: {
    100: '#E6F4F8',
    200: '#B3D9E6',
    300: '#80BFD4',
    400: '#4DA4C2',
    500: '#0a7ea4',
    600: '#086B8A',
    700: '#065870',
    800: '#044556',
    900: '#02323C',
  },
  secondary: {
    100: '#E6E8EB',
    200: '#B3B9C2',
    300: '#808A99',
    400: '#4D5B70',
    500: '#687076',
    600: '#565C61',
    700: '#45484C',
    800: '#343437',
    900: '#232426',
  },
  gray: {
    100: '#F7F7F7',
    200: '#E6E6E6',
    300: '#E6E8EB',
    400: '#9BA1A6',
    500: '#687076',
    600: '#565C61',
    700: '#45484C',
    800: '#343437',
    900: '#232426',
  },
  error: {
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  warning: {
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  success: {
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  accent: {
    100: '#F0F9FF',
    200: '#E0F2FE',
    300: '#BAE6FD',
    400: '#7DD3FC',
    500: '#38BDF8',
    600: '#0EA5E9',
    700: '#0284C7',
    800: '#0369A1',
    900: '#075985',
  },
  white: '#FFFFFF',
  transparent: 'transparent',
  black: '#000000',
};

export default Colors;
