import { Link } from 'react-router-dom';
import { Badge, IconButton } from '@mui/material';
import { ShoppingCartOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';

// routes
import { PATH_MAIN } from '../../routes/path';

const CartPopover = () => {
	const { totalItem } = useSelector((state) => state.cart);
	return (
		<Badge
			color="error"
			badgeContent={totalItem}
			max={99}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			sx={{ m: 1 }}
		>
			<Link to={PATH_MAIN.cart}>
				<IconButton color="error">
					<ShoppingCartOutlined />
				</IconButton>
			</Link>
		</Badge>
	);
};

export default CartPopover;
