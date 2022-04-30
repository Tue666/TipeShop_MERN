import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Stack, Typography, Skeleton } from '@mui/material';

// apis
import productApi from '../apis/productApi';
// _external
import Carousel from './_external_/slick-carousel/Carousel';
import { settingProductSection } from './_external_/slick-carousel/Settings';
// components
import ProductCard from './ProductCard';

const propTypes = {
	id: PropTypes.string,
	type: PropTypes.string,
	title: PropTypes.string,
	sx: PropTypes.object,
};

const SkeletonLoad = [...Array(6)].map((_, index) => (
	<Stack key={index} sx={{ p: 2 }}>
		<Skeleton variant="rectangular" width={180} height={180} />
		<Skeleton variant="text" height={45} />
		<Skeleton variant="text" width={150} />
		<Skeleton variant="text" width={130} />
	</Stack>
));

const ProductSection = ({ id, type, title, sx }) => {
	const limit = 10;
	const [products, setProducts] = useState(null);
	useEffect(() => {
		const getProducts = async () => {
			let products = await productApi.findRankingProducts(type, limit);
			setProducts(products);
		};
		getProducts();
	}, [type]);
	return (
		<Stack id={id} sx={{ ...sx }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<Typography variant="h6">{title}</Typography>
				<Link to="/auth" underline="hover">
					<Typography variant="subtitle2" color="error">
						View more <i className="bi bi-chevron-right"></i>
					</Typography>
				</Link>
			</Stack>
			<Carousel settings={settingProductSection}>
				{products && products.map((product) => <ProductCard key={product._id} product={product} />)}
				{!products && SkeletonLoad}
			</Carousel>
		</Stack>
	);
};

ProductSection.propTypes = propTypes;

export default ProductSection;
