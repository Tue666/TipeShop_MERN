import PropTypes from 'prop-types';
import { useMediaQuery } from '@mui/material';

const propTypes = {
	width: PropTypes.oneOf([
		'xsDown',
		'smDown',
		'mdDown',
		'lgDown',
		'xlDown',
		'xsUp',
		'smUp',
		'mdUp',
		'lgUp',
		'xlUp',
	]).isRequired,
	children: PropTypes.node,
};

const Hidden = ({ width, children }) => {
	const breakpoint = width.substring(0, 2);
	const hiddenUp = useMediaQuery((theme) => theme.breakpoints.up(breakpoint));
	const hiddenDown = useMediaQuery((theme) => theme.breakpoints.down(breakpoint));

	if (width.includes('Down')) return hiddenDown ? null : children;
	if (width.includes('Up')) return hiddenUp ? null : children;
	return null;
};

Hidden.propTypes = propTypes;

export default Hidden;
