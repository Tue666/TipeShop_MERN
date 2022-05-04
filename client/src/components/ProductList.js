import PropTypes from 'prop-types';
import { useState, Fragment } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Typography, CircularProgress } from '@mui/material';

// components
import ProductCard from './ProductCard';
// hooks
import useInfiniteProduct from '../hooks/useInfiniteProduct';

const propTypes = {
	id: PropTypes.string,
	title: PropTypes.string,
};

const ProductList = ({ id, title }) => {
	const [page, setPage] = useState(1);
	const { isLoading, hasMore, products } = useInfiniteProduct(page, 10);
	const handleLoadMore = () => {
		setPage((prevPage) => prevPage + 1);
	};
	return (
		<Stack id={id}>
			<Typography variant="h6">{title}</Typography>
			<Wrapper>
				{products.length !== 0 && (
					<Fragment>
						{products.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}

						<LoadMore>
							{!isLoading && hasMore && (
								<LoadButton onClick={handleLoadMore}>
									<Typography variant="subtitle2">Load more</Typography>
								</LoadButton>
							)}
							{isLoading && <CircularProgress size={25} color="error" />}
						</LoadMore>
					</Fragment>
				)}
			</Wrapper>
		</Stack>
	);
};

const Wrapper = styled('div')({
	position: 'relative',
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	marginBottom: '50px',
});

const LoadMore = styled('div')({
	position: 'absolute',
	bottom: '-70px',
	left: '30%',
	width: '40%',
	height: '50px',
	margin: '10px 0',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const LoadButton = styled('div')(({ theme }) => ({
	width: '100%',
	padding: '15px',
	borderRadius: '15px',
	backgroundColor: theme.palette.background.paper,
	boxShadow: '5px 3px 7px rgb(145 158 171 / 24%)',
	transition: '0.5s',
	cursor: 'pointer',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	'&:hover': {
		color: '#fff',
		backgroundColor: theme.palette.error.main,
	},
}));

ProductList.propTypes = propTypes;

export default ProductList;
