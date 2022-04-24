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
				src="https://www.graphicsprings.com/filestorage/stencils/bdc5649fb67a5ab2fc8b4a0dc0eac951.png?width=500&height=500"
				alt=""
				sx={{
					width: '109px',
					height: '109px',
					...sx,
				}}
			/>
			<Typography variant="h6">{children}</Typography>
		</Box>
	</Link>
);

Logo.propTypes = propTypes;

export default Logo;
