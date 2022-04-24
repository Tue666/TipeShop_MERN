import { Link } from 'react-router-dom';
import { Badge, IconButton } from '@mui/material';
import { ShoppingCartOutlined } from '@mui/icons-material';

const CartPopover = () => {
	return (
		<Badge
			color="error"
			badgeContent={999}
			max={99}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			sx={{ m: 1 }}
		>
			<Link to="/cart">
				<IconButton color="error">
					<ShoppingCartOutlined />
				</IconButton>
			</Link>
		</Badge>
	);
};

export default CartPopover;
