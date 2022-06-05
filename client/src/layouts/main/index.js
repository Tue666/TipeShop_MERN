import React from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// constant
import { HEADER_HEIGHT, MAIN_PADDING } from '../../constant';
//
import HeaderTop from './HeaderTop';
import HeaderBottom from './HeaderBottom';
import Footer from './Footer';

const HEADER = {
	HEIGHT: HEADER_HEIGHT,
	PADDING: MAIN_PADDING,
};

const MainLayout = () => {
	return (
		<React.Fragment>
			<Header>
				<HeaderTop />
				<HeaderBottom />
			</Header>
			<HeaderSpacing />
			<Outlet />
			<Footer />
		</React.Fragment>
	);
};

const Header = styled('div')(({ theme }) => ({
	height: HEADER.HEIGHT,
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	display: 'flex',
	flexDirection: 'column',
	padding: HEADER.PADDING,
	backgroundColor: theme.palette.background.paper,
	zIndex: 999,
	[theme.breakpoints.down('sm')]: {
		padding: '5px',
	},
}));

const HeaderSpacing = styled('div')({
	height: HEADER_HEIGHT,
	marginBottom: '10px',
});

export default MainLayout;
