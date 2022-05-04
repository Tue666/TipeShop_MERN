import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

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

const Result = () => {
	return (
		<RootStyle>
			<Stack direction="row" alignItems="center" spacing={1} sx={{ m: '15px' }}>
				<Typography variant="h6">X: </Typography>
				<Typography variant="subtitle1" fontSize="17px">
					30
				</Typography>
			</Stack>
			<Stack sx={{ position: 'relative' }}>
				<FilterWrapper direction="row" alignItems="center">
					{FILTER_NAVS.map((nav) => (
						<FilterText key={nav.label} className="active" onClick={() => {}}>
							{nav.label}
						</FilterText>
					))}
				</FilterWrapper>
			</Stack>
		</RootStyle>
	);
};

const RootStyle = styled(Stack)(({ theme }) => ({
	width: `calc(100% - ${CATEGORY_PAGE.FILTER_WIDTH})`,
	backgroundColor: theme.palette.background.paper,
	[theme.breakpoints.down('sm')]: {
		width: '100%',
	},
}));

const FilterWrapper = styled(Stack)(({ theme }) => ({
	borderTop: `2px solid ${theme.palette.background.default} `,
	position: 'sticky',
	top: HEADER_HEIGHT,
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

export default Result;
