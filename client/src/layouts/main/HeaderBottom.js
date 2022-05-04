import { Grid } from '@mui/material';

// components
import Logo from '../../components/Logo';
import Hidden from '../../components/Hidden';
//
import SearchBar from './SearchBar';
import CartPopover from './CartPopover';
import SwitchTheme from './SwitchTheme';

const HeaderBottom = () => {
	return (
		<Grid container alignItems="center" sx={{ flexGrow: 1 }}>
			<Hidden width="mdDown">
				<Grid item md={3} align="center">
					<Logo>Tipe</Logo>
				</Grid>
				<Grid item md={6} align="center">
					<SearchBar />
				</Grid>
				<Grid item md={3} align="center">
					<CartPopover />
					<SwitchTheme />
				</Grid>
			</Hidden>
			<Hidden width="mdUp">
				<Grid item xs={6} align="center">
					<Logo sx={{ width: '50px', height: '50px' }}>Tipe</Logo>
				</Grid>
				<Grid item xs={6} align="center">
					<CartPopover />
					<SwitchTheme />
				</Grid>
				<Grid item xs={12} align="center">
					<SearchBar />
				</Grid>
			</Hidden>
		</Grid>
	);
};

export default HeaderBottom;
