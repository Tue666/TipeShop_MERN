import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-scroll';

// constant
import { HEADER_HEIGHT } from '../constant';

export const ScrollToTop = () => {
	const { pathname, search } = useLocation();
	const url = `${pathname}?${search}`;
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [url]);
	return null;
};

// combile SpeedDial & react-scroll
export const combineLink = (to, children) => (
	<Link to={to} duration={500} offset={parseInt(HEADER_HEIGHT.slice(0, -2)) * -1}>
		{children}
	</Link>
);
