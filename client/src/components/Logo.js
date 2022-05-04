import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// routes
import { PATH_MAIN } from '../routes/path';

const propTypes = {
	children: PropTypes.node,
	sx: PropTypes.object,
};

const Logo = ({ children, sx }) => (
	<Link to={PATH_MAIN.home}>
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Box
				component="img"
				src="/logo.png"
				alt="Tipe Logo"
				mr={1}
				sx={{
					width: '80px',
					height: '80px',
					...sx,
				}}
			/>
			<Typography variant="h6">{children}</Typography>
		</Box>
	</Link>
);

Logo.propTypes = propTypes;

export default Logo;
