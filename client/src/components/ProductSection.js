import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Stack, Typography, Skeleton } from '@mui/material';

// _external
import Carousel from './_external_/slick-carousel/Carousel';
import { settingProductSection } from './_external_/slick-carousel/Settings';
// components
import ProductCard from './ProductCard';

const propTypes = {
	id: PropTypes.string,
	title: PropTypes.string,
	sx: PropTypes.object,
};

const SkeletonLoad = [...Array(5)].map((_, index) => (
	<Stack key={index} sx={{ p: 2 }}>
		<Skeleton variant="rectangular" width={180} height={180} />
		<Skeleton variant="text" height={45} />
		<Skeleton variant="text" width={150} />
		<Skeleton variant="text" width={130} />
	</Stack>
));

const ProductSection = ({ id, title, sx }) => {
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
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				{1 === 2 && SkeletonLoad}
			</Carousel>
		</Stack>
	);
};

ProductSection.propTypes = propTypes;

export default ProductSection;
