import { number, array } from 'prop-types';
import { styled } from '@mui/material/styles';
import { Stack, Checkbox, Typography, IconButton, Tooltip } from '@mui/material';
import { DeleteForeverOutlined, Favorite } from '@mui/icons-material';

// constant
import { HEADER_HEIGHT, CART_PAGE } from '../../constant';
//
import CartItem from './CartItem';

const propTypes = {
	items: array,
	totalItem: number,
};

const CartList = ({ items, totalItem }) => {
	const isSelectedAll = items && items.filter((item) => item.selected).length > 0;
	return (
		<RootStyle>
			<Heading>
				<Stack spacing={1} direction="row" alignItems="center" sx={{ cursor: 'pointer' }}>
					<Checkbox size="small" checked={isSelectedAll} checkedIcon={<Favorite />} color="error" />
					<Typography variant="subtitle2">All ({totalItem} products)</Typography>
				</Stack>
				<Typography variant="subtitle2">Single</Typography>
				<Typography variant="subtitle2">Quantity</Typography>
				<Typography variant="subtitle2">Price</Typography>
				<Tooltip placement="bottom" title="Remove selected items" arrow>
					<IconButton color="error" onClick={() => {}}>
						<DeleteForeverOutlined />
					</IconButton>
				</Tooltip>
			</Heading>
			<Stack spacing={2}>
				<ContentGroup>
					{/* Seller */}
					{/* Intended */}
					<Stack spacing={3}>
						{items.map((item) => {
							const { _id } = item;
							return <CartItem key={_id} item={item} />;
						})}
					</Stack>
					{/* Seller discount */}
				</ContentGroup>
			</Stack>
		</RootStyle>
	);
};

const RootStyle = styled('div')(({ theme }) => ({
	width: CART_PAGE.CART_LIST_WIDTH,
	[theme.breakpoints.down('md')]: {
		width: '100%',
	},
}));

const Heading = styled('div')(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: CART_PAGE.GRID_TEMPLATE_COLUMNS,
	alignItems: 'center',
	backgroundColor: theme.palette.background.paper,
	borderRadius: '5px',
	position: 'sticky',
	top: `calc(${HEADER_HEIGHT} + 10px)`,
	padding: '5px',
	zIndex: 99,
	'&:before, &:after': {
		content: '""',
		position: 'absolute',
		width: '100%',
		height: '10px',
		backgroundColor: theme.palette.background.default,
	},
	'&:before': {
		top: '-10px',
	},
	'&:after': {
		bottom: '-10px',
	},
}));

const ContentGroup = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	borderRadius: '5px',
	padding: '5px',
	marginTop: '10px',
}));

// const ProgessBar = styled('div')(({ theme, achieved }) => ({
//     position: 'relative',
//     display: 'flex',
//     justifyContent: 'space-between',
//     width: `calc(${CART_WIDTH} - 150px)`,
//     margin: '17px 20px',
//     '&:before': {
//         content: '""',
//         position: 'absolute',
//         backgroundColor: theme.palette.background.default,
//         borderRadius: '100px',
//         width: `calc(${CART_WIDTH} - 150px)`,
//         height: '6px',
//         transform: 'translateY(-50%)',
//         top: '50%',
//         zIndex: 0
//     },
//     '&:after': {
//         content: '""',
//         position: 'absolute',
//         background: 'linear-gradient(90deg,rgb(0, 173, 87) 0%, rgb(119, 218, 144) 105.65%)',
//         borderRadius: '100px',
//         width: `${achieved}%`,
//         height: '6px',
//         transform: 'translateY(-50%)',
//         top: '50%',
//         zIndex: 1,
//         transition: 'width 0.5s ease-in 0s'
//     }
// }));

// const Marked = styled('div')(({ theme, position, achieved }) => ({
//     position: 'relative',
//     display: 'flex',
//     justifyContent: 'center',
//     zIndex: 2,
//     width: '16px',
//     height: '16px',
//     borderRadius: '50%',
//     backgroundColor: `${position === 'first' ? 'rgba(0,0,0,0)' : achieved === 'true' ? 'rgb(214, 250, 223)' : theme.palette.background.paper}`,
//     border: `${position !== 'first' ? '1px solid rgb(221, 221, 227)' : 'none'}`
// }));

// const Text = styled('div')(({ theme, location }) => ({
//     position: 'absolute',
//     top: `${location === 'top' ? '-16px' : '16px'}`,
//     fontSize: '11px',
//     color: theme.palette.text.primary,
//     fontWeight: '500'
// }));

CartList.propTypes = propTypes;

export default CartList;
