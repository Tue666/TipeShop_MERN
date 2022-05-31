import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Stack, Typography, Link } from '@mui/material';
import { AddLocationAltOutlined } from '@mui/icons-material';

// components
import Page from '../../components/Page';
// routes
import { PATH_CUSTOMER } from '../../routes/path';

const Addresses = () => {
	return (
		<Page title="Addresses book | Tipe">
			<Add to={PATH_CUSTOMER.addressForm} component={RouterLink}>
				<AddLocationAltOutlined />
				Add new address
			</Add>
			<Stack spacing={1}>
				{[...Array(3)].map((_, index) => (
					<Address key={index}>
						<div>
							<div>
								<Typography component="span" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
									pi he
								</Typography>
								<Typography
									component="span"
									variant="caption"
									color="success.main"
									ml={2}
									sx={{ fontWeight: 'bold' }}
								>
									<i className="bi bi-check-circle"></i> Default address
								</Typography>
							</div>
							<div>
								<Typography component="span" variant="caption">
									Address:{' '}
								</Typography>
								<Typography component="span" variant="subtitle2">
									Chùa liên trì, Xã Suối Cao, Huyện Xuân Lộc, Đồng Nai
								</Typography>
							</div>
							<div>
								<Typography component="span" variant="caption">
									Phone number:{' '}
								</Typography>
								<Typography component="span" variant="subtitle2">
									0968366601
								</Typography>
							</div>
						</div>
						<div>
							<Link
								to="/"
								component={RouterLink}
								color="success.main"
								sx={{ fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}
							>
								Edit
							</Link>
							<Typography
								component="span"
								variant="subtitle2"
								color="error.main"
								ml={2}
								sx={{ cursor: 'pointer' }}
							>
								Remove
							</Typography>
						</div>
					</Address>
				))}
			</Stack>
		</Page>
	);
};

const Add = styled(Link)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	border: `1px dashed ${theme.palette.success.main}`,
	height: '60px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	marginBottom: theme.spacing(1),
	cursor: 'pointer',
	fontSize: '14px',
	textDecoration: 'none',
	fontWeight: 'bold',
}));

const Address = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(2),
	borderRadius: '5px',
	display: 'flex',
	justifyContent: 'space-between',
}));

export default Addresses;
