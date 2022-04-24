import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const propTypes = {
	children: PropTypes.node,
	title: PropTypes.string,
};

const Page = ({ children, title = 'Tipe Shop' }) => (
	<React.Fragment>
		<Helmet>
			<title>{title}</title>
		</Helmet>
		{children}
	</React.Fragment>
);

Page.propTypes = propTypes;

export default Page;
