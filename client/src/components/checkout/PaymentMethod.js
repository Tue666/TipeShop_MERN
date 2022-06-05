import { string } from 'prop-types';
import { styled } from '@mui/material/styles';
import {
	Stack,
	Box,
	Typography,
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
} from '@mui/material';
import { useDispatch } from 'react-redux';

// redux
import { changePaymentMethod } from '../../redux/slices/cart';

const PAYMENT_METHOD = [
	{
		value: 'cash',
		icon:
			'https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-cod.svg',
		label: 'Cash payment upon receipt',
	},
];

const propTypes = {
	paymentKey: string,
};

const PaymentMethod = ({ paymentKey }) => {
	const dispatch = useDispatch();

	const handleChangePaymentMethod = (e) => {
		const key = e.target.value;
		const label = PAYMENT_METHOD.find((method) => method.value === key).label;
		dispatch(
			changePaymentMethod({
				key,
				label,
			})
		);
	};
	return (
		<Wrapper spacing={1}>
			<Typography variant="subtitle2">Payment method</Typography>
			<FormControl>
				<RadioGroup value={paymentKey} onChange={handleChangePaymentMethod}>
					{PAYMENT_METHOD.map((method) => {
						const { value, icon, label } = method;
						return (
							<FormControlLabel
								key={value}
								value={value}
								control={<Radio size="small" />}
								label={
									<Stack direction="row" alignItems="center" spacing={1}>
										<Box component="img" alt={value} src={icon} />
										<Typography variant="subtitle2">{label}</Typography>
									</Stack>
								}
							/>
						);
					})}
				</RadioGroup>
			</FormControl>
		</Wrapper>
	);
};

const Wrapper = styled(Stack)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	borderRadius: '5px',
	padding: '15px',
}));

PaymentMethod.propTypes = propTypes;

export default PaymentMethod;
