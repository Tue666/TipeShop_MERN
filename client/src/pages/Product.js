import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Container, Stack, Skeleton, LinearProgress } from '@mui/material';
import {
	ImportContacts,
	FileCopy,
	Article,
	Description as DescriptionIcon,
	Star,
	More,
} from '@mui/icons-material';

// apis
import productApi from '../apis/productApi';
// components
import Page from '../components/Page';
import Teleport from '../components/Teleport';
import { combineLink } from '../components/ScrollToTop';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductSection from '../components/ProductSection';
import ProductList from '../components/ProductList';
import { ImageZoom, Information, Specification, Description, Review } from '../components/product';
// constant
import { HEADER_HEIGHT } from '../constant';

const actions = [
	{ icon: combineLink('information', <ImportContacts />), name: 'Product information' },
	{ icon: combineLink('similar-section', <FileCopy />), name: 'Similar products' },
	{ icon: combineLink('specifications', <Article />), name: 'Specifications' },
	{ icon: combineLink('description', <DescriptionIcon />), name: 'Product description' },
	{ icon: combineLink('review', <Star />), name: 'Ratings - Reviews from customers' },
	{ icon: combineLink('product-list', <More />), name: 'Discover more for you' },
];

const Product = () => {
	const [product, setProduct] = useState(null);
	const [similarSection, setSimilarSection] = useState(null);
	const { _id } = useParams();
	useEffect(() => {
		const getProduct = async () => {
			const productResponse = await productApi.findById(_id);
			const similarProducts = await productApi.findSimilarProducts(_id, 10);
			const {
				name,
				quantity,
				rating_average,
				review_count,
				quantity_sold,
				original_price,
				price,
				discount_rate,
				attribute_values,
				warranty_infor,
				inventory_status,
				...parts
			} = productResponse;
			setProduct({
				...parts,
				information: {
					_id,
					name,
					quantity,
					rating_average,
					review_count,
					quantity_sold,
					discount_rate,
					original_price,
					price,
					attribute_values,
					warranty_infor,
					inventory_status,
				},
			});
			setSimilarSection(similarProducts);
		};
		getProduct();

		return () => setProduct(null);
	}, [_id]);
	return (
		<Page title={`${product?.information.name || ''} | Tipe Shop`}>
			<Container>
				<Teleport actions={actions} />
				{product && (
					<Fragment>
						<Breadcrumbs
							header={product.information.name}
							links={product.breadcrumbs.map((item) => ({
								title: item.name,
								href: `/${item.slug}/cid${item._id}`,
							}))}
						/>
						<Wrapper id="information" sx={{ p: 0, mt: 0 }}>
							<Stack direction={{ xs: 'column', sm: 'row', lg: 'row' }} justifyContent="space-between">
								<ImageZoom images={product.images} />
								<Information information={product.information} />
							</Stack>
						</Wrapper>
						{similarSection && similarSection.length > 0 && (
							<Wrapper>
								<Title>Similar Products</Title>
								<ProductSection id="similar-section" products={similarSection} />
							</Wrapper>
						)}
						{product.specifications.length > 0 && (
							<Wrapper id="specifications">
								<Title>Specifications</Title>
								<Specification specifications={product.specifications} />
							</Wrapper>
						)}
						{product.description && (
							<Wrapper id="description">
								<Title>Product Description</Title>
								<Description description={product.description} />
							</Wrapper>
						)}
						<Wrapper id="review">
							<Title>Ratings - Reviews from customers</Title>
							<Review />
						</Wrapper>
					</Fragment>
				)}

				{!product && (
					<Fragment>
						<Wrapper>
							<Stack direction={{ xs: 'column', sm: 'row', lg: 'row' }} justifyContent="space-between">
								<Stack spacing={1}>
									<Skeleton variant="rectangular" width={410} height={360} />
									<Stack direction="row" spacing={1}>
										{[...Array(5)].map((_, index) => (
											<Skeleton key={index} variant="rectangular" width={75} height={65} />
										))}
									</Stack>
								</Stack>
								<Stack spacing={1} sx={{ width: 'calc(100% - 450px)' }}>
									<Skeleton variant="text" height={50} />
									<Skeleton variant="text" width={400} />
									<Skeleton variant="rectangular" width={500} height={100} />
									<Skeleton variant="text" width={400} />
									<Skeleton variant="text" width={400} />
									<Skeleton variant="text" width={400} />
									<Skeleton variant="text" width={400} />
									<Skeleton variant="text" width={400} />
									<Stack direction="row" spacing={2}>
										<Skeleton variant="rectangular" width={150} height={50} />
										<Skeleton variant="rectangular" width={150} height={50} />
									</Stack>
								</Stack>
							</Stack>
						</Wrapper>
						<Wrapper sx={{ display: 'flex' }}>
							{[...Array(5)].map((_, index) => (
								<Stack key={index} sx={{ p: 2 }}>
									<Skeleton variant="rectangular" width={180} height={180} />
									<Skeleton variant="text" height={45} />
									<Skeleton variant="text" width={150} />
									<Skeleton variant="text" width={130} />
								</Stack>
							))}
						</Wrapper>
						<LinearProgress />
					</Fragment>
				)}
				<Stack>
					<DiscoverMore>Discover more for you</DiscoverMore>
					<ProductList id="product-list" />
				</Stack>
			</Container>
		</Page>
	);
};

const Wrapper = styled('div')(({ theme }) => ({
	margin: '20px 0',
	padding: '15px',
	backgroundColor: theme.palette.background.paper,
}));

const Title = styled('span')({
	fontWeight: 'bold',
	fontSize: '15px',
	display: 'block',
	paddingBottom: '10px',
	textTransform: 'capitalize',
});

const DiscoverMore = styled('div')(({ theme }) => ({
	padding: '15px',
	fontWeight: 'bold',
	backgroundColor: theme.palette.background.paper,
	position: 'sticky',
	top: `calc(${HEADER_HEIGHT} + 9px)`,
	zIndex: 99,
	marginBottom: '10px',
	'&:before, &:after': {
		content: '""',
		position: 'absolute',
		width: '100%',
		height: '10px',
		backgroundColor: theme.palette.background.default,
		left: 0,
	},
	'&:before': {
		top: '-10px',
	},
	'&:after': {
		bottom: '-10px',
	},
}));

export default Product;
