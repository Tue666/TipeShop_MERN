import { useState, useRef, useReducer, useEffect } from 'react';
import { Stack, Tabs, Tab, TextField, InputAdornment, Pagination } from '@mui/material';
import { Search } from '@mui/icons-material';

// apis
import orderApi from '../../apis/orderApi';
// components
import { OrderPanel } from '../../components/customer';

const ORDER_TABS = [
	{
		value: 'all',
		label: 'ALL ORDERS',
	},
	{
		value: 'processing',
		label: 'PROCESSING',
	},
	{
		value: 'transporting',
		label: 'TRANSPORTING',
	},
	{
		value: 'delivered',
		label: 'DELIVERED',
	},
	{
		value: 'cancelled',
		label: 'CANCELLED',
	},
];

const initialState = {
	all: null,
	processing: null,
	transporting: null,
	delivered: null,
	cancelled: null,
};

const handlers = {
	FILL_TAB: (state, action) => {
		const { value, orders } = action.payload;
		return {
			...state,
			[value]: orders,
		};
	},
};

const reducer = (state, action) =>
	handlers[action.type] ? handlers[action.type](state, action) : state;

const Orders = () => {
	const [current, setCurrent] = useState({
		value: 'all',
		page: 1,
		limit: 10,
	});
	const memory = useRef([]);
	const [state, dispatch] = useReducer(reducer, initialState);
	useEffect(() => {
		if (!memory.current.includes(current.value)) {
			console.log('effect called');

			const { value, page, limit } = current;
			const status = value !== 'all' ? value : '';
			memory.current.push(value);
			const getOrders = async () => {
				const response = await orderApi.findByStatus(page, limit, status);
				const { orders } = response;
				dispatch({
					type: 'FILL_TAB',
					payload: {
						value,
						orders,
					},
				});
			};
			getOrders();
		}
	}, [current]);

	const handleChangeTab = (e, newValue) => {
		setCurrent({
			...current,
			value: newValue,
		});
	};
	console.log(memory);
	return (
		<Stack spacing={1}>
			<Tabs
				value={current.value}
				variant="fullWidth"
				onChange={handleChangeTab}
				sx={{ bgcolor: (theme) => theme.palette.background.paper }}
			>
				{ORDER_TABS.map((tab) => {
					const { value, label } = tab;
					return <Tab key={value} label={label} value={value} />;
				})}
			</Tabs>
			<Stack direction="row" alignItems="center">
				<TextField
					fullWidth
					variant="outlined"
					size="small"
					placeholder="Find order by order number"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Search />
							</InputAdornment>
						),
					}}
					sx={{ bgcolor: (theme) => theme.palette.background.paper }}
				/>
			</Stack>
			{ORDER_TABS.map((tab) => {
				const { value } = tab;
				const isActive = value === current.value;
				return isActive && <OrderPanel key={value} orders={state[current.value]} />;
			})}
			<Pagination color="error" page={1} count={10} sx={{ alignSelf: 'end' }} />
		</Stack>
	);
};

export default Orders;
