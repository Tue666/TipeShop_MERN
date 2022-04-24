import { FormControlLabel, Switch } from '@mui/material';

// hooks
import useSettings from '../../hooks/useSettings';

const SwitchTheme = () => {
	const { themeMode, onChangeTheme } = useSettings();
	return (
		<FormControlLabel
			style={{ margin: '0 10px' }}
			control={
				<Switch size="small" checked={themeMode === 'dark'} onChange={onChangeTheme} color="error" />
			}
			label={themeMode === 'dark' ? <span>🌜</span> : <span>🌞</span>}
		/>
	);
};

export default SwitchTheme;
