import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

// constant
import { PAYMENT_PAGE } from '../../constant';
//
import IntendedDelivery from './IntendedDelivery';
import PaymentMethod from './PaymentMethod';

const CheckoutSection = ({ selectedItems, paymentKey }) => {
	return (
		<RootStyle spacing={2}>
			<IntendedDelivery selectedItems={selectedItems} />
			<PaymentMethod paymentKey={paymentKey} />
		</RootStyle>
	);
};

const RootStyle = styled(Stack)(({ theme }) => ({
	width: PAYMENT_PAGE.CHECKOUT_SECTION_WIDTH,
	[theme.breakpoints.down('md')]: {
		width: '100%',
	},
}));

export default CheckoutSection;
