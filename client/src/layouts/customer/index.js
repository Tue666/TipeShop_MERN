import { Fragment } from 'react';
import { Outlet, matchPath } from 'react-router-dom';
import { Container, Stack, Typography } from '@mui/material';
import { AccountBox, LocalMall, ImportContacts } from '@mui/icons-material';
import { useSelector } from 'react-redux';

// components
import Breadcrumbs from '../../components/Breadcrumbs';
import Avatar from '../../components/Avatar';
// routes
import { PATH_CUSTOMER } from '../../routes/path';
// config
import { appConfig } from '../../config';
//
import NavSection from './NavSection';

const MENUS = [
	{
		label: 'Account information',
		icon: <AccountBox />,
		linkTo: PATH_CUSTOMER.profile,
	},
	{
		label: 'Order management',
		icon: <LocalMall />,
		linkTo: PATH_CUSTOMER.orders,
	},
	{
		label: 'Addresses book',
		icon: <ImportContacts />,
		linkTo: PATH_CUSTOMER.addresses,
	},
];

const CustomerLayout = () => {
	const { profile, addresses } = useSelector((state) => state.account);
	const menuActived = MENUS.filter((menu) => {
		const pathname = window.location.pathname;
		return (
			matchPath({ path: `${menu.linkTo}` }, pathname) ||
			matchPath({ path: `${menu.linkTo}/:type` }, pathname) || // path contains type for create maybe
			matchPath({ path: `${menu.linkTo}/:type/:value` }, pathname) // path contains type for update maybe
		);
	})[0];
	return (
		<Container>
			<Breadcrumbs header={menuActived.label} links={[]} />
			<Stack direction="row" spacing={2}>
				{profile && (
					<Fragment>
						<Stack sx={{ width: '250px' }}>
							<Stack direction="row" alignItems="center" spacing={1}>
								<Avatar
									name={profile.name}
									src={profile.avatar_url ? profile.avatar_url : `${appConfig.public_image_url}/avatar.png`}
									sx={{ width: '65px', height: '65px' }}
								/>
								<Stack>
									<Typography variant="caption">Account of</Typography>
									<Typography variant="body1" sx={{ fontWeight: 'bold' }}>
										{profile.name}
									</Typography>
								</Stack>
							</Stack>
							<NavSection navConfig={MENUS} activedPath={menuActived.linkTo} />
						</Stack>
						<Stack spacing={2} sx={{ flex: 1 }}>
							<Typography variant="h6">{menuActived.label}</Typography>
							<Outlet
								context={{
									profile,
									addresses,
								}}
							/>
						</Stack>
					</Fragment>
				)}
			</Stack>
		</Container>
	);
};

export default CustomerLayout;
