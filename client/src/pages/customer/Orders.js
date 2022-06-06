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
		value: 'canceled',
		label: 'CANCELED',
	},
];

const initialState = {
	all: {
		orders: null,
		totalPage: 0,
	},
	processing: {
		orders: null,
		totalPage: 0,
	},
	transporting: {
		orders: null,
		totalPage: 0,
	},
	delivered: {
		orders: null,
		totalPage: 0,
	},
	canceled: {
		orders: null,
		totalPage: 0,
	},
};

const handlers = {
	FILL_TAB: (state, action) => {
		const { value, orders, pagination } = action.payload;
		const { totalPage } = pagination;
		return {
			...state,
			[value]: {
				orders,
				totalPage,
			},
		};
	},
};

const reducer = (state, action) =>
	handlers[action.type] ? handlers[action.type](state, action) : state;

const Orders = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [current, setCurrent] = useState({
		value: 'all',
		page: 1,
		limit: 10,
		search: '',
	});
	const searchRef = useRef('');
	const visited = useRef({
		tabs: [],
		page: 1,
		search: '',
	}); // store tabs are visited to prevent fetch redundant data
	useEffect(() => {
		const { value, page, limit, search } = current;

		// refresh visited whenever search change
		if (visited.current.search !== search) {
			visited.current = {
				...visited.current,
				tabs: [],
				page: 1,
				search,
			};
		}

		const isVisitedTab = visited.current.tabs.includes(value);
		// only fetch new data when first time visited or page has been changed
		const fetching = !isVisitedTab || visited.current.page !== page;
		if (fetching) {
			// update visited
			visited.current = {
				...visited.current,
				tabs: !isVisitedTab ? [...visited.current.tabs, value] : [...visited.current.tabs],
				page,
			};
			const status = value !== 'all' ? value : '';
			const getOrders = async () => {
				const response = await orderApi.findByStatus(page, limit, status, search);
				const { orders, pagination } = response;
				dispatch({
					type: 'FILL_TAB',
					payload: {
						value,
						orders,
						pagination,
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
			page: 1,
		});
	};
	const handleChangeSearch = (e) => {
		const value = e.target.value;
		// Debounce
		if (searchRef.current) clearTimeout(searchRef.current);
		searchRef.current = setTimeout(() => {
			setCurrent({
				...current,
				search: value,
				page: 1,
			});
		}, 500);
	};
	const handleChangePage = (e, value) => {
		setCurrent({
			...current,
			page: value,
		});
		window.scrollTo(0, 0);
	};
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
					onChange={handleChangeSearch}
					sx={{ bgcolor: (theme) => theme.palette.background.paper }}
				/>
			</Stack>
			{ORDER_TABS.map((tab) => {
				const { value } = tab;
				const isActive = value === current.value;
				return isActive && <OrderPanel key={value} orders={state[current.value].orders} />;
			})}
			{state[current.value].totalPage > 1 && (
				<Pagination
					color="error"
					page={current.page}
					count={state[current.value].totalPage}
					hidePrevButton={current.page <= 1}
					hideNextButton={current.page >= state[current.value].totalPage}
					onChange={handleChangePage}
					sx={{ alignSelf: 'end' }}
				/>
			)}
		</Stack>
	);
};

export default Orders;
