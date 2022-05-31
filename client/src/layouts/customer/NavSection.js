import { arrayOf, shape, string, node } from 'prop-types';
import { Link } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

const propTypes = {
	navConfig: arrayOf(
		shape({
			label: string,
			icon: node,
			linkTo: string,
		})
	),
	activedPath: string,
};

const NavSection = ({ navConfig, activedPath }) => {
	return (
		<List component="nav" dense>
			{navConfig.map((item) => {
				const { label, icon, linkTo } = item;
				return (
					<ListItemButton key={label} selected={linkTo === activedPath}>
						<ListItemIcon>{icon}</ListItemIcon>
						<Link to={linkTo}>
							<ListItemText primary={label} />
						</Link>
					</ListItemButton>
				);
			})}
		</List>
	);
};

NavSection.propTypes = propTypes;

export default NavSection;
