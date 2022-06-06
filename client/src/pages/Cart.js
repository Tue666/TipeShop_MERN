import { Link } from 'react-router-dom';
import { Container, Stack, Typography, Alert, AlertTitle, Button } from '@mui/material';
import { useSelector } from 'react-redux';

// components
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';
import ImageLoader from '../components/ImageLoader';
import { CartList, TotalPrice } from '../components/cart';
// routes
import { PATH_MAIN } from '../routes/path';
// config
import { apiConfig } from '../config';

const Cart = () => {
	const { items, totalItem } = useSelector((state) => state.cart);
	const selectedItems = items.filter((item) => item.selected && item.product.quantity > 0);
	const selectedCount = selectedItems.length;
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
						<TotalPrice selectedItems={selectedItems} selectedCount={selectedCount} />
					</Stack>
				)}
				{totalItem <= 0 && (
					<Stack
						alignItems="center"
						spacing={1}
						sx={{ p: 5, backgroundColor: (theme) => theme.palette.background.paper }}
					>
						<ImageLoader
							src={`${apiConfig.image_url}/_external_/buy_more.png`}
							alt="buy_more"
							sx={{ width: '190px', height: '160px' }}
						/>
						<Typography variant="subtitle2">There are no products in your cart.</Typography>
						<Link to={PATH_MAIN.home}>
							<Button color="warning" variant="contained" disableElevation>
								BUY NOW
							</Button>
						</Link>
					</Stack>
				)}
			</Container>
		</Page>
	);
};

export default Cart;
