import { Outlet, matchPath } from 'react-router-dom';
import { Container, Stack, Typography } from '@mui/material';
import { AccountBox, ImportContacts } from '@mui/icons-material';

// components
import Breadcrumbs from '../../components/Breadcrumbs';
import Avatar from '../../components/Avatar';
// routes
import { PATH_CUSTOMER } from '../../routes/path';
// config
import { apiConfig } from '../../config';
//
import NavSection from './NavSection';

const MENUS = [
	{
		label: 'Account information',
		icon: <AccountBox />,
		linkTo: PATH_CUSTOMER.profile,
	},
	{
		label: 'Addresses book',
		icon: <ImportContacts />,
		linkTo: PATH_CUSTOMER.addresses,
	},
];

const CustomerLayout = () => {
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
				<Stack sx={{ width: '250px' }}>
					<Stack direction="row" alignItems="center" spacing={1}>
						<Avatar
							name="zxbc"
							src={`${apiConfig.image_url}/_external_/avatar/avatar.png`}
							sx={{ width: '65px', height: '65px' }}
						/>
						<Stack>
							<Typography variant="caption">Account of</Typography>
							<Typography variant="body1" sx={{ fontWeight: 'bold' }}>
								Lê Chính Tuệ
							</Typography>
						</Stack>
					</Stack>
					<NavSection navConfig={MENUS} activedPath={menuActived.linkTo} />
				</Stack>
				<Stack spacing={2} sx={{ flex: 1 }}>
					<Typography variant="h6">{menuActived.label}</Typography>
					<Outlet />
				</Stack>
			</Stack>
		</Container>
	);
};

export default CustomerLayout;
