import { string, array, object } from 'prop-types';
import { Link } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';

// _external
import Carousel from './_external_/slick-carousel/Carousel';
import { settingProductSection } from './_external_/slick-carousel/Settings';
// components
import ProductCard from './ProductCard';

const propTypes = {
	id: string,
	title: string,
	products: array,
	sx: object,
};

const ProductSection = ({ id, title, products, sx }) => {
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
			<Carousel
				settings={{
					...settingProductSection,
					infinite: products.length > 5 ? true : false,
				}}
			>
				{products && products.map((product) => <ProductCard key={product._id} product={product} />)}
			</Carousel>
		</Stack>
	);
};

ProductSection.propTypes = propTypes;

export default ProductSection;
