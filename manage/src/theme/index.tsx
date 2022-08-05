export type ThemeMode = 'light' | 'dark';

type ThemeProps = {
  [type in ThemeMode]: {
    [key: string]: string;
  };
};

export const theme: ThemeProps = {
  light: {
    '@body-background': '#f5f8fA',
    '@component-background': '#fff',
    '@text-color': '#000000',
  },
  dark: {
    '@body-background': '#312e2e',
    '@component-background': '#242424',
    '@text-color': '#fff',
  },
};
