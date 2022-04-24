import PropTypes from 'prop-types';
import {
	ThemeProvider,
	createTheme,
	CssBaseline,
	GlobalStyles as MuiGlobalStyles,
} from '@mui/material';

// hooks
import useSettings from '../hooks/useSettings';
//
import GlobalStyles from './globalStyles';
import palette from './palette';

const propTypes = {
	children: PropTypes.node,
};

const ThemeConfig = ({ children }) => {
	const { themeMode } = useSettings();
	const isLight = themeMode === 'light';
	const themeOptions = {
		palette: isLight ? { ...palette.light, mode: 'light' } : { ...palette.dark, mode: 'dark' },
		typography: {
			fontFamily: 'Quicksand',
		},
	};
	const theme = createTheme(themeOptions);
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<MuiGlobalStyles styles={GlobalStyles(theme)} />
			{children}
		</ThemeProvider>
	);
};

ThemeConfig.propTypes = propTypes;

export default ThemeConfig;
