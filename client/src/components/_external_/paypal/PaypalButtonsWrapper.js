import { shape, arrayOf, string, number, func } from 'prop-types';
import { useState, useEffect } from 'react';
import { Stack, Typography, Alert } from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

// utils
import { currencyConverter } from '../../../utils/formatMoney';
import { fDate } from '../../../utils/formatDate';
// config
import { paymentConfig } from '../../../config';

const propTypes = {
	address: shape({
		name: string,
		country: string,
		region: shape({
			name: string,
		}),
		district: shape({
			name: string,
		}),
		ward: shape({
			name: string,
		}),
		street: string,
	}),
	selectedItems: arrayOf(
		shape({
			product: shape({
				name: string,
				price: number,
			}),
			quantity: number,
		})
	),
	priceSummary: arrayOf(
		shape({
			value: number,
			sign: number,
		})
	),
	handleOrder: func,
};

const PaypalButtonsWrapper = ({ address, selectedItems, priceSummary, handleOrder }) => {
	const [currencyConverted, setCurrencyConverted] = useState(0.00004314); // default settings in case the api goes down =)))))
	const { name, street, ward, district, region, country, phone_number } = address;
	const items = selectedItems.map((item) => ({
		name: item.product.name,
		quantity: item.quantity,
		value: parseInt((item.product.price * currencyConverted).toFixed()),
	}));
	const totalItemPrice = items.reduce((sum, item) => sum + item.value * item.quantity, 0);
	const totalDiscount = priceSummary.reduce(
		(sum, item) => (item.sign < 0 ? sum + parseInt((item.value * currencyConverted).toFixed()) : sum),
		0
	);
	const totalPrice = totalItemPrice - totalDiscount;
	useEffect(() => {
		const convertCurrencyValue = async () => {
			const convertedValue = await currencyConverter('VND', 'USD');
			setCurrencyConverted(convertedValue);
		};
		convertCurrencyValue();
	}, []);

	const handleCreateOrder = (data, actions) => {
		const request = {
			purchase_units: [
				{
					amount: {
						currency_code: 'USD',
						value: totalPrice,
						breakdown: {
							item_total: {
								currency_code: 'USD',
								value: totalItemPrice,
							},
							discount: {
								currency_code: 'USD',
								value: totalDiscount,
							},
						},
					},
					description: `Pay the bill for ${phone_number}. Amount ${totalPrice} USD on ${fDate(
						Date.now()
					)} (Exchange rate: 1 VND = ${currencyConverted} $)`,
					items: items.map((item) => {
						const { name, quantity, value } = item;
						return {
							name,
							quantity,
							unit_amount: {
								currency_code: 'USD',
								value,
							},
						};
					}),
					shipping: {
						name: {
							full_name: name,
						},
						address: {
							country_code: country,
							address_line_1: `${street}, ${ward.name}`,
							admin_area_1: region.name,
							admin_area_2: district.name,
						},
					},
				},
			],
			application_context: {
				shipping_preference: 'SET_PROVIDED_ADDRESS',
			},
		};
		return actions.order.create(request);
	};
	const handleApproveOrder = async (data, actions) => {
		const order = await actions.order.capture();
		const { status, purchase_units } = order;
		const { description, payments } = purchase_units[0];
		handleOrder(false, {
			paid: status === 'COMPLETED',
			message: payments.captures[0].status,
			description,
		});
	};
	return (
		<PayPalScriptProvider options={paymentConfig.paypal}>
			<Stack spacing={1}>
				<Stack spacing={1} sx={{ bgcolor: (theme) => theme.palette.background.paper, padding: '10px' }}>
					<Alert severity="info">Exchange currency on the market</Alert>
					<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
						1 VND = {currencyConverted} $
					</Typography>
				</Stack>
				<PayPalButtons
					forceReRender={[totalPrice]}
					createOrder={(data, actions) => handleCreateOrder(data, actions)}
					onApprove={(data, actions) => handleApproveOrder(data, actions)}
				/>
			</Stack>
		</PayPalScriptProvider>
	);
};

PaypalButtonsWrapper.propTypes = propTypes;

export default PaypalButtonsWrapper;
