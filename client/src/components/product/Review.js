import { Fragment } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Typography, Pagination } from '@mui/material';
import { StarRounded } from '@mui/icons-material';

// components
import Stars from '../Stars';
import Comment from './Comment';

const Review = () => {
	return (
		<Fragment>
			<Stack direction={{ xs: 'column', md: 'row', lg: 'row' }}>
				<Stack sx={{ width: '335px' }} mb={2}>
					<Stack direction="row" alignItems="center">
						<Typography variant="h3" sx={{ p: 2, fontWeight: 'bold' }}>
							4
						</Typography>
						<Stack justifyContent="center">
							<Stars total={5} rating={4} />
							<Typography variant="caption">100 ratings</Typography>
						</Stack>
					</Stack>
					<Stack>
						<Stack direction="row" alignItems="center">
							<Stars total={5} rating={5} />
							<Range total={100} votes={80} />
							<Typography variant="caption">80</Typography>
						</Stack>
						<Stack direction="row" alignItems="center">
							<Stars total={5} rating={4} />
							<Range total={100} votes={10} />
							<Typography variant="caption">10</Typography>
						</Stack>
						<Stack direction="row" alignItems="center">
							<Stars total={5} rating={3} />
							<Range total={100} votes={8} />
							<Typography variant="caption">8</Typography>
						</Stack>
						<Stack direction="row" alignItems="center">
							<Stars total={5} rating={2} />
							<Range total={100} votes={2} />
							<Typography variant="caption">2</Typography>
						</Stack>
						<Stack direction="row" alignItems="center">
							<Stars total={5} rating={1} />
							<Range total={100} votes={0} />
							<Typography variant="caption">0</Typography>
						</Stack>
					</Stack>
				</Stack>
				<Stack>
					<Typography variant="subtitle2">Filter reviews by:</Typography>
					<Stack direction="row" alignItems="center">
						<Filter>Mới nhất</Filter>
						<Filter>
							5 <StarRounded fontSize="small" sx={{ color: 'rgb(253, 216, 54)' }} />
						</Filter>
						<Filter>
							4 <StarRounded fontSize="small" sx={{ color: 'rgb(253, 216, 54)' }} />
						</Filter>
						<Filter>
							3 <StarRounded fontSize="small" sx={{ color: 'rgb(253, 216, 54)' }} />
						</Filter>
						<Filter>
							2 <StarRounded fontSize="small" sx={{ color: 'rgb(253, 216, 54)' }} />
						</Filter>
						<Filter>
							1 <StarRounded fontSize="small" sx={{ color: 'rgb(253, 216, 54)' }} />
						</Filter>
					</Stack>
				</Stack>
			</Stack>
			<Stack>
				<Comment />
				<Comment />
			</Stack>
			<PaginationWrapper>
				<Pagination
					color="error"
					page={1}
					count={10}
					// hidePrevButton={pagination.page <= 1}
					// hideNextButton={pagination.page >= pagination.totalPage}
					// onChange={(event, value) => handleNavigate('page', value)}
				/>
			</PaginationWrapper>
		</Fragment>
	);
};

const Range = styled('div')(({ votes, total }) => ({
	width: '150px',
	height: '6px',
	backgroundColor: 'rgb(238, 238, 238)',
	position: 'relative',
	zIndex: 1,
	margin: '0px 6px',
	borderRadius: '99em',
	'&:before': {
		content: '""',
		width: `calc(100%*${votes}/${total})`,
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'rgb(120, 120, 120)',
		borderRadius: '99em',
	},
}));

const Filter = styled('div')(({ theme }) => ({
	display: 'flex',
	fontSize: '14px',
	padding: '10px 17px',
	borderRadius: '20px',
	backgroundColor: theme.palette.background.default,
	margin: '0px 12px 12px 0px',
	cursor: 'pointer',
	'&:hover': {
		backgroundColor: '#f53d2d',
		color: '#fff',
		transition: '0.3s',
	},
}));

const PaginationWrapper = styled('div')({
	marginTop: '20px',
	display: 'flex',
	justifyContent: 'flex-end',
});

export default Review;
