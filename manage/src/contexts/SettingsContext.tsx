import { ReactNode, useState, createContext } from 'react';

// theme
import { theme, ThemeMode } from '../theme';

interface SettingsContextStates {
  themeMode: ThemeMode;
}
interface SettingsContextMethods {
  onChangeTheme: (currentMode: ThemeMode) => void;
}

interface SettingsProviderProps {
  children: ReactNode;
}

const initialState: SettingsContextStates & SettingsContextMethods = {
  themeMode: 'light',
  onChangeTheme: () => {},
};
const SettingsContext = createContext<SettingsContextStates & SettingsContextMethods>(initialState);

const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<SettingsContextStates>(() => {
    const themeLocalStorage: SettingsContextStates = {
      themeMode: 'light',
    };
    (window as any).less.modifyVars(theme[themeLocalStorage.themeMode]);
    return themeLocalStorage;
  });
  const onChangeTheme = async (currentMode: ThemeMode): Promise<void> => {
    try {
      await (window as any).less.modifyVars(theme[currentMode]);
      setSettings({
        ...settings,
        themeMode: currentMode,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SettingsContext.Provider value={{ ...settings, onChangeTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsProvider, SettingsContext };
