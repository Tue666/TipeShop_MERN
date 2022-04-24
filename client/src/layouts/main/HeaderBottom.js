import React from 'react';
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
		<React.Fragment>
			<Hidden width="mdDown">
				<Grid container alignItems="center" columnSpacing={2}>
					<Grid item md={3} align="center">
						<Logo>Tipe Shop</Logo>
					</Grid>
					<Grid item md={6} align="center">
						<SearchBar />
					</Grid>
					<Grid item md={3} align="center">
						<CartPopover />
						<SwitchTheme />
					</Grid>
				</Grid>
			</Hidden>
			<Hidden width="mdUp">
				<Grid container alignItems="center">
					<Grid item xs={6} align="center">
						<Logo sx={{ width: '65px', height: '65px' }}>Tipe Shop</Logo>
					</Grid>
					<Grid item xs={6} align="center">
						<CartPopover />
						<SwitchTheme />
					</Grid>
					<Grid item xs={12} align="center">
						<SearchBar />
					</Grid>
				</Grid>
			</Hidden>
		</React.Fragment>
	);
};

export default HeaderBottom;
