import { Container, Stack, Typography, Alert, AlertTitle } from '@mui/material';
import { useSelector } from 'react-redux';

// components
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import { CartList, TotalPrice } from '../components/cart';

const Cart = () => {
	const { items, totalItem } = useSelector((state) => state.cart);
	console.log(items);
	return (
		<Page title="Cart | Tipe">
			<Container>
				<Breadcrumbs header="Cart" links={[]} />
				{/* Events start */}
				<Alert severity="info">
					<AlertTitle>Promotional events</AlertTitle>
					Free shipping for orders from 50M <strong>(April 2022 - July 2022)</strong>
				</Alert>
				{/* Events end */}

				<Typography variant="h5" sx={{ mb: 2 }}>
					Cart
				</Typography>
				{totalItem > 0 && (
					<Stack direction={{ xs: 'column', sm: 'column', lg: 'row' }} justifyContent="space-between">
						<CartList items={items} totalItem={totalItem} />
						<TotalPrice />
					</Stack>
				)}
				{totalItem <= 0 && 'BUY NOW...'}
			</Container>
		</Page>
	);
};

export default Cart;
