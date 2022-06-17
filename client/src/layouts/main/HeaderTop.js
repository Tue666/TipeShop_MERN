import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Stack, Link } from '@mui/material';
import { useSelector } from 'react-redux';

// components
import Hidden from '../../components/Hidden';
// hooks
import useModal from '../../hooks/useModal';
import useAuth from '../../hooks/useAuth';
// routes
import { PATH_MAIN } from '../../routes/path';
//
import AccountPopover from './AccountPopover';

const HeaderTop = () => {
	const { profile } = useSelector((state) => state.account);
	const { isAuthenticated, logout } = useAuth();
	const { openModal, keys } = useModal();
	const handleOpenAuthentication = () => {
		openModal(keys.authentication);
	};
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
						<Linking component={RouterLink} to={PATH_MAIN.news}>
							<i className="bi bi-file-earmark-richtext"></i> News
						</Linking>
						<Linking component="a" href="https://www.facebook.com/exe.shiro" target="_blank">
							<i className="bi bi-question-circle"></i> Support
						</Linking>
						{isAuthenticated && profile ? (
							<AccountPopover profile={profile} logout={logout} />
						) : (
							<Label onClick={handleOpenAuthentication}>Sign in / Sign up</Label>
						)}
					</Stack>
				</Stack>
			</Hidden>
			<Hidden width="mdUp">
				<Label>
					<i className="bi bi-list"></i>
				</Label>
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

export default HeaderTop;
