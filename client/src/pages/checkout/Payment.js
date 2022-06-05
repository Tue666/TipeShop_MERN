import { Container, Stack } from '@mui/material';
import { useSelector } from 'react-redux';

// components
import Page from '../../components/Page';
import { CheckoutSection } from '../../components/checkout';
import { TotalPrice } from '../../components/cart';

const Payment = () => {
	const { items, paymentMethod } = useSelector((state) => state.cart);
	const selectedItems = items.filter((item) => item.selected && item.product.quantity > 0);
	const selectedCount = selectedItems.length;
	return (
		<Page title="Payment details | Tipe">
			<Container>
				<Stack direction={{ xs: 'column', sm: 'column', lg: 'row' }} justifyContent="space-between" my={2}>
					<CheckoutSection selectedItems={selectedItems} paymentKey={paymentMethod.key} />
					<TotalPrice
						selectedItems={selectedItems}
						selectedCount={selectedCount}
						paymentMethod={paymentMethod}
					/>
				</Stack>
			</Container>
		</Page>
	);
};

export default Payment;
