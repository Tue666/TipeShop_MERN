import { useState, useEffect, Fragment } from 'react';
import { Container, Grid, Stack, Skeleton } from '@mui/material';
import {
	ViewCarousel,
	LocalFireDepartment,
	Category,
	ScreenSearchDesktop,
	Preview,
	Ballot,
} from '@mui/icons-material';

// apis
import productApi from '../apis/productApi';
// components
import Page from '../components/Page';
import Teleport from '../components/Teleport';
import { combineLink } from '../components/ScrollToTop';
import { Banners, Categories } from '../components/home';
import ProductSection from '../components/ProductSection';
import ProductList from '../components/ProductList';

const actions = [
	{ icon: combineLink('banners', <ViewCarousel />), name: 'Banners' },
	{ icon: combineLink('sold-section', <LocalFireDepartment />), name: 'Hot selling products' },
	{ icon: combineLink('categories', <Category />), name: 'Categories' },
	{ icon: combineLink('search-section', <ScreenSearchDesktop />), name: 'Most searching products' },
	{ icon: combineLink('view-section', <Preview />), name: 'Top view products' },
	{ icon: combineLink('product-list', <Ballot />), name: 'Suggestions for you' },
];

const SkeletonLoad = (
	<Stack spacing={3}>
		<Grid container spacing={1}>
			<Grid item md={8} sm={6} xs={12}>
				<Skeleton variant="rectangular" height={400} />
			</Grid>
			<Grid item md={4} sm={6} xs={12}>
				<Skeleton variant="rectangular" height={400} />
			</Grid>
			<Grid item md={6} sm={6} xs={12}>
				<Skeleton variant="rectangular" height={250} />
			</Grid>
			<Grid item md={6} sm={6} xs={12}>
				<Skeleton variant="rectangular" height={250} />
			</Grid>
		</Grid>
		<Stack direction="row">
			{[...Array(5)].map((_, index) => (
				<Stack key={index} sx={{ p: 2 }}>
					<Skeleton variant="rectangular" width={180} height={180} />
					<Skeleton variant="text" height={45} />
					<Skeleton variant="text" width={150} />
					<Skeleton variant="text" width={130} />
				</Stack>
			))}
		</Stack>
	</Stack>
);

const Home = () => {
	const [sections, setSections] = useState(null);
	useEffect(() => {
		const getProductSection = async () => {
			const soldSection = await productApi.findRankingProducts('sold', 10);
			const favoriteSection = await productApi.findRankingProducts('favorite', 10);
			const viewSection = await productApi.findRankingProducts('view', 10);
			// const [soldSection, favoriteSection, viewSection] = await Promise.all([
			// 	productApi.findRankingProducts('sold', 10),
			// 	productApi.findRankingProducts('favorite', 10),
			// 	productApi.findRankingProducts('view', 10),
			// ]);
			setSections({
				soldSection,
				favoriteSection,
				viewSection,
			});
		};
		getProductSection();
	}, []);
	return (
		<Page title="Tipe Shop - Buy online, good price, good quality, fast shipping">
			<Container>
				{sections && (
					<Fragment>
						<Teleport actions={actions} />
						<Stack spacing={3}>
							<Banners id="banners" />
							<ProductSection id="sold-section" title="🛍  Hot selling products" products={sections.soldSection} />
							<Categories id="categories" title="📦  Categories" />
							<ProductSection
								id="search-section"
								title="💖  Most likes products"
								products={sections.favoriteSection}
							/>
							<ProductSection id="view-section" title="👀  Top view products" products={sections.viewSection} />
							<ProductList id="product-list" title="🥰  Suggestions for you" />
						</Stack>
					</Fragment>
				)}
				{!sections && SkeletonLoad}
			</Container>
		</Page>
	);
};

export default Home;
