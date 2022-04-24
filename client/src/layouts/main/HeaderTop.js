import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Stack, Link } from '@mui/material';

// components
import Hidden from '../../components/Hidden';

const HeaderTop = () => {
	return (
		<React.Fragment>
			<Hidden width="mdDown">
				<Stack direction="row" justifyContent="space-between">
					<Stack direction="row" justifyContent="space-between">
						<Linking component="a" href="https://www.facebook.com/exe.shiro" target="_blank">
							<i className="bi bi-file-arrow-down"></i> Download app
						</Linking>
						<Linking component="a" href="https://www.facebook.com/exe.shiro" target="_blank">
							<i className="bi bi-code-slash"></i> Connect
						</Linking>
					</Stack>
					<Stack direction="row" justifyContent="space-between">
						<Linking component="a" href="https://www.facebook.com/exe.shiro" target="_blank">
							<i className="bi bi-bell"></i> Notification
						</Linking>
						<Linking component="a" href="https://www.facebook.com/exe.shiro" target="_blank">
							<i className="bi bi-question-circle"></i> Support
						</Linking>
						<Linking component={RouterLink} to="/" sx={{ ml: '20px', borderRight: '1px solid #ccc' }}>
							Sign in
						</Linking>
						<Linking component={RouterLink} to="/">
							Sign up
						</Linking>
					</Stack>
				</Stack>
			</Hidden>
			<Hidden width="mdUp">
				<LabelIcon>
					<i className="bi bi-list"></i>
				</LabelIcon>
			</Hidden>
		</React.Fragment>
	);
};

const Linking = styled(Link)(({ theme }) => ({
	color: theme.palette.text.primary,
	textDecoration: 'none',
	padding: '0px 10px',
	fontWeight: '500',
	transition: '0.3s',
	fontSize: '13px',
	borderBottom: '1px solid transparent',
	'&:hover': {
		color: theme.palette.error.main,
		borderBottom: `1px solid ${theme.palette.error.main}`,
	},
}));

const LabelIcon = styled('span')(({ theme }) => ({
	padding: '0px 10px',
	fontWeight: '500',
	transition: '0.3s',
	fontSize: '14px',
	cursor: 'pointer',
	borderBottom: '1px solid transparent',
	'&:hover': {
		color: theme.palette.error.main,
	},
}));

export default HeaderTop;
