import { Fragment } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Grid, Stack, Typography, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useConfirm } from 'material-ui-confirm';

// components
import Page from '../../components/Page';
import { DeliveryAddress } from '../../components/checkout';
// redux
import { switchDefault, removeAddress } from '../../redux/slices/account';
// routes
import { PATH_MAIN, PATH_CUSTOMER, PATH_CHECKOUT } from '../../routes/path';

const Shipping = () => {
	const { addresses } = useSelector((state) => state.account);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const confirm = useConfirm();

	const handleSwitchAddress = (_id) => {
		dispatch(switchDefault(_id));
		const isInCart = searchParams.get('isIntendedCart');
		if (isInCart) navigate(PATH_MAIN.cart);
		else navigate(PATH_CHECKOUT.payment);
	};
	const handleNavigate = (_id = null) => {
		const linkTo = _id ? `${PATH_CUSTOMER.editAddress}/${_id}` : PATH_CUSTOMER.createAddress;
		navigate(linkTo, {
			state: {
				isIntendedCheckout: true,
			},
		});
	};
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
		<Page title="Shipment details | Tipe">
			<Container sx={{ my: '24px' }}>
				<Stack spacing={1}>
					<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
						2. Delivery address
					</Typography>
					{addresses.length > 0 && (
						<Fragment>
							<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
								Choose from the available shipping addresses below:
							</Typography>
							<Grid container spacing={2}>
								{addresses.map((address) => (
									<Grid key={address._id} item md={6} sm={12} xs={12}>
										<DeliveryAddress
											address={address}
											handleSwitch={handleSwitchAddress}
											handleNavigate={handleNavigate}
											handleRemove={handleRemoveAddress}
										/>
									</Grid>
								))}
							</Grid>
						</Fragment>
					)}
					<div>
						<Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>
							Want to deliver to another address?&nbsp;
						</Typography>
						<Typography
							variant="subtitle2"
							component="span"
							sx={{ fontWeight: 'bold', color: 'rgb(26 139 237)', cursor: 'pointer' }}
							onClick={() => handleNavigate()}
						>
							Add new delivery address
						</Typography>
					</div>
				</Stack>
			</Container>
		</Page>
	);
};

export default Shipping;
