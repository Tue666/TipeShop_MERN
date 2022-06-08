import { Link as RouterLink, useOutletContext } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Stack, Typography, Link, Alert } from '@mui/material';
import { AddLocationAltOutlined } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useConfirm } from 'material-ui-confirm';

// components
import Page from '../../components/Page';
// redux
import { removeAddress } from '../../redux/slices/account';
// routes
import { PATH_CUSTOMER } from '../../routes/path';

const Addresses = () => {
	const { addresses } = useOutletContext();
	const dispatch = useDispatch();
	const confirm = useConfirm();

	const handleRemoveAddress = async (_id) => {
		try {
			await confirm({
				title: 'Remove address',
				content: <Alert severity="error">Do you want to remove the selected address?</Alert>,
				confirmationButtonProps: {
					color: 'error',
				},
			});
			dispatch(removeAddress(_id));
		} catch (error) {}
	};
	return (
		<Page title="Addresses book | Tipe">
			<Add to={PATH_CUSTOMER.createAddress} component={RouterLink}>
				<AddLocationAltOutlined />
				Add new address
			</Add>
			<Stack spacing={1}>
				{addresses.length > 0 &&
					addresses.map((address) => {
						const { _id, name, region, district, ward, street, phone_number, is_default } = address;
						const delivery_address = `${street}, ${ward.name}, ${district.name}, ${region.name}`;
						return (
							<Address key={_id}>
								<div>
									<div>
										<Typography component="span" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
											{name}
										</Typography>
										{is_default && (
											<Typography
												component="span"
												variant="caption"
												color="success.main"
												ml={2}
												sx={{ fontWeight: 'bold' }}
											>
												<i className="bi bi-check-circle"></i> Default address
											</Typography>
										)}
									</div>
									<div>
										<Typography component="span" variant="caption">
											Address:&nbsp;
										</Typography>
										<Typography component="span" variant="subtitle2">
											{delivery_address}
										</Typography>
									</div>
									<div>
										<Typography component="span" variant="caption">
											Phone number:&nbsp;
										</Typography>
										<Typography component="span" variant="subtitle2">
											{phone_number}
										</Typography>
									</div>
								</div>
								<div>
									<Link
										to={`${PATH_CUSTOMER.editAddress}/${_id}`}
										component={RouterLink}
										color="success.main"
										sx={{ fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}
									>
										Edit
									</Link>
									{!is_default && (
										<Typography
											component="span"
											variant="subtitle2"
											color="error.main"
											ml={2}
											sx={{ cursor: 'pointer' }}
											onClick={() => handleRemoveAddress(_id)}
										>
											Remove
										</Typography>
									)}
								</div>
							</Address>
						);
					})}
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
