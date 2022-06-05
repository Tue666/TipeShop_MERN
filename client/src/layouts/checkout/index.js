import React from 'react';
import { Outlet } from 'react-router-dom';

//
import Header from './Header';
import Footer from './Footer';

const CheckoutLayout = () => {
	return (
		<React.Fragment>
			<Header />
			<Outlet />
			<Footer />
		</React.Fragment>
	);
};

export default CheckoutLayout;
