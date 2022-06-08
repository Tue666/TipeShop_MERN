import { shape, func, string } from 'prop-types';
import { useState, Fragment } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Popover, Stack, Divider, MenuList, MenuItem, ListItemIcon } from '@mui/material';
import { AssignmentIndOutlined, LogoutOutlined } from '@mui/icons-material';

// components
import Avatar from '../../components/Avatar';
// routes
import { PATH_CUSTOMER } from '../../routes/path';
// config
import { appConfig } from '../../config';

const MENU_OPTIONS = [
	{
		label: 'My Profile',
		icon: <AssignmentIndOutlined />,
		linkTo: PATH_CUSTOMER.profile,
	},
];

const propTypes = {
	profile: shape({
		name: string,
		avatar_url: string,
	}),
	logout: func,
};

const AccountPopover = ({ profile, logout }) => {
	const { name, avatar_url } = profile;
	const [anchorEl, setAnchorEl] = useState(null);
	const navigate = useNavigate();

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<Fragment>
			<Label onClick={handleClick}>
				{name} <i className="bi bi-caret-down"></i>
			</Label>
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<Stack alignItems="center" p={2} pb={1} sx={{ width: '230px' }}>
					<Avatar
						name={name}
						src={avatar_url ? avatar_url : `${appConfig.public_image_url}/avatar.png`}
						sx={{ width: '65px', height: '65px' }}
					/>
					<MenuList dense sx={{ width: '100%' }}>
						{MENU_OPTIONS.map((menu) => (
							<MenuItem key={menu.label} onClick={() => navigate(menu.linkTo)}>
								<ListItemIcon>{menu.icon}</ListItemIcon>
								{menu.label}
							</MenuItem>
						))}
						<Divider />
						<MenuItem onClick={logout}>
							<ListItemIcon>
								<LogoutOutlined />
							</ListItemIcon>
							Log out
						</MenuItem>
					</MenuList>
				</Stack>
			</Popover>
		</Fragment>
	);
};

const Label = styled('span')(({ theme }) => ({
	padding: '0px 10px',
	fontWeight: '500',
	transition: '0.3s',
	fontSize: '13px',
	cursor: 'pointer',
	borderBottom: '1px solid transparent',
	'&:hover': {
		color: theme.palette.error.main,
	},
}));

AccountPopover.propTypes = propTypes;

export default AccountPopover;
