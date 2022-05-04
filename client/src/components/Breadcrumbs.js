import { oneOfType, array, arrayOf, shape, string } from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';

// routes
import { PATH_MAIN } from '../routes/path';

const propTypes = {
	header: string.isRequired,
	links: oneOfType([
		array,
		arrayOf(
			shape({
				title: string,
				href: string,
			})
		),
	]),
};

const Breadcrumbs = ({ header, links }) => {
	return (
		<RootStyle separator=">">
			<Link component={RouterLink} to={PATH_MAIN.home} color="inherit" underline="none" fontSize={14}>
				Home
			</Link>
			{links &&
				links.map((link, index) => (
					<Link
						key={index}
						component={RouterLink}
						to={link.href}
						color="inherit"
						underline="none"
						fontSize={14}
					>
						{link.title}
					</Link>
				))}
			<Typography fontSize="15px" color="text.primary">
				{header}
			</Typography>
		</RootStyle>
	);
};

const RootStyle = styled(MuiBreadcrumbs)({
	paddingBottom: '10px',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	'& ol, & li, p': {
		display: 'inline',
	},
});

Breadcrumbs.propTypes = propTypes;

export default Breadcrumbs;
