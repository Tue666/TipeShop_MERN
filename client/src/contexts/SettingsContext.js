import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const initalSettings = {
	themeMode: 'light',
	onChangeTheme: () => {},
};

const SettingsContext = createContext(initalSettings);

const SettingsProvider = ({ children }) => {
	const [settings, setSettings] = useLocalStorage('settings', {
		themeMode: 'light',
	});
	const onChangeTheme = (e) => {
		setSettings({
			...settings,
			themeMode: e.target.checked ? 'dark' : 'light',
		});
	};
	return (
		<SettingsContext.Provider
			value={{
				...settings,
				onChangeTheme,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export { SettingsProvider, SettingsContext };
