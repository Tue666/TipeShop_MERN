import { Container, Stack } from '@mui/material';
import {
	ViewCarousel,
	LocalFireDepartment,
	Category,
	ScreenSearchDesktop,
	Preview,
	Ballot,
} from '@mui/icons-material';

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

const Home = () => {
	return (
		<Page title="Tipe Shop - Buy online, good price, good quality, fast shipping">
			<Container>
				<Teleport actions={actions} />
				<Stack spacing={3}>
					<Banners id="banners" />
					<ProductSection id="sold-section" type="sold" title="🛍  Hot selling products" />
					<Categories id="categories" title="📦  Categories" />
					<ProductSection id="search-section" type="searched" title="🔍  Most searching products" />
					<ProductSection id="view-section" type="viewed" title="👀  Top view products" />
					<ProductList id="product-list" title="🥰  Suggestions for you" />
				</Stack>
			</Container>
		</Page>
	);
};

export default Home;
