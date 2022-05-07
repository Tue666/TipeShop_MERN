import { shape, number, string, array, object, func } from 'prop-types';
import { styled } from '@mui/material/styles';
import { Stack, Typography, Alert, Pagination, Chip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

// external
import Carousel from '../../components/_external_/slick-carousel/Carousel';
import { settingBanners } from '../../components/_external_/slick-carousel/Settings';
// component
import ImageLoader from '../../components/ImageLoader';
import ProductCard from '../../components/ProductCard';
// config
import { apiConfig } from '../../config';
// constant
import { HEADER_HEIGHT, CATEGORY_PAGE } from '../../constant';

const FILTER_NAVS = [
	{
		label: 'Popular',
		sort: 'default',
	},
	{
		label: 'Hot selling',
		sort: 'top_seller',
	},
	{
		label: 'Newest',
		sort: 'newest',
	},
	{
		label: 'Cheap',
		sort: 'price-asc',
	},
	{
		label: 'Expensive',
		sort: 'price-desc',
	},
];

const propTypes = {
	queryParams: object,
	parts: shape({
		name: string,
		banners: array,
	}),
	result: shape({
		products: array,
		totalProduct: number,
		pagination: shape({
			page: number,
			totalPage: number,
		}),
	}),
	handleNavigate: func,
	getDisplayFilteredName: func,
};

const Result = ({ queryParams, parts, result, handleNavigate, getDisplayFilteredName }) => {
	const { name, banners } = parts;
	const { products, totalProduct, pagination } = result;
	let chips = [];
	// stupid code, find other solutions if free
	Object.keys(queryParams).map((key) => {
		const values = getDisplayFilteredName(key, queryParams[key]);
		return values.map((value) => chips.push(value));
	});
	return (
		<RootStyle>
			<Wrapper direction="row" alignItems="center" spacing={1} p={2}>
				<Typography variant="h6">{name}: </Typography>
				<Typography variant="subtitle1" fontSize="17px">
					{totalProduct}
				</Typography>
			</Wrapper>
			{banners && banners.length > 0 && (
				<Wrapper pb={1}>
					<Carousel settings={settingBanners}>
						{banners.map((image, index) => (
							<ImageLoader key={index} src={`${apiConfig.image_url}/${image}`} alt={`banner-${name}`} />
						))}
					</Carousel>
				</Wrapper>
			)}
			<Wrapper sx={{ position: 'relative' }}>
				<FilterWrapper direction="row" alignItems="center">
					{FILTER_NAVS.map((nav) => (
						<FilterText
							key={nav.label}
							className={nav.sort === (queryParams['sort'] || 'default') ? 'active' : ''}
							onClick={() => handleNavigate('sort', nav.sort)}
						>
							{nav.label}
						</FilterText>
					))}
				</FilterWrapper>
				{chips.length > 0 && (
					<Stack direction="row" alignItems="center" spacing={1} sx={{ m: 2 }}>
						{chips.map((chip, index) => (
							<Chip key={index} label={chip.display} color="error" size="small" onDelete={() => {}} />
						))}
						<Typography variant="subtitle2" color="error" onClick={() => {}} sx={{ cursor: 'pointer' }}>
							Remove all
						</Typography>
					</Stack>
				)}
				{totalProduct > 0 && (
					<ResultWrapper>
						{products && products.map((product) => <ProductCard key={product._id} product={product} />)}
					</ResultWrapper>
				)}
				{totalProduct <= 0 && (
					<Stack alignItems="center" py={5}>
						<Alert icon={<HelpOutline />} severity="warning">
							Sorry, no products were found to match your selection
						</Alert>
					</Stack>
				)}
			</Wrapper>
			{totalProduct > 0 && (
				<PaginationWrapper>
					<Pagination
						color="error"
						page={pagination.page}
						count={pagination.totalPage}
						hidePrevButton={pagination.page <= 1}
						hideNextButton={pagination.page >= pagination.totalPage}
						onChange={(event, value) => handleNavigate('page', value)}
					/>
				</PaginationWrapper>
			)}
		</RootStyle>
	);
};

const RootStyle = styled(Stack)(({ theme }) => ({
	width: `calc(100% - ${CATEGORY_PAGE.FILTER_WIDTH})`,
	[theme.breakpoints.down('sm')]: {
		width: '100%',
	},
}));

const Wrapper = styled(Stack)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
}));

const ResultWrapper = styled('div')({
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	paddingBlock: '10px',
});

const FilterWrapper = styled(Stack)(({ theme }) => ({
	borderBottom: `2px solid ${theme.palette.background.default} `,
	position: 'sticky',
	top: `calc(${HEADER_HEIGHT} - 1px)`,
	zIndex: '99',
	backgroundColor: theme.palette.background.paper,
}));

const FilterText = styled('span')({
	textTransform: 'capitalize',
	cursor: 'pointer',
	fontSize: '14px',
	margin: '0 16px',
	padding: '8px',
	'&:hover, &.active': {
		color: '#f53d2d',
		borderBottom: '4px solid #f53d2d',
	},
});

const PaginationWrapper = styled('div')({
	marginTop: '20px',
	alignSelf: 'end',
});

Result.propTypes = propTypes;

export default Result;
