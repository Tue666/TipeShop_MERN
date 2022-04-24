import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

// components
import ImageLoader from '../ImageLoader';
import ToggleShowAll from '../ToggleShowAll';

const propTypes = {
	id: PropTypes.string,
	title: PropTypes.string,
};

const Categories = ({ id, title }) => {
	return (
		<Box id={id}>
			<Typography variant="h6">{title}</Typography>
			<ToggleShowAll>
				<RootStyle container justifyContent="center">
					<Grid item lg={2} sm={3} xs={6}>
						<Link to="/">
							<Category>
								<ImageLoader
									src="https://salt.tikicdn.com/cache/w100/ts/product/12/9a/0b/b174bfac897abb303dba03f19ea1b4d7.jpg"
									alt="Image..."
									sx={{
										width: '80px',
										height: '50px',
										borderRadius: '35%',
										marginRight: '15px',
									}}
								/>
								<Name title="zxc">zxc</Name>
							</Category>
						</Link>
					</Grid>
					<Grid item lg={2} sm={3} xs={6}>
						<Link to="/">
							<Category>
								<ImageLoader
									src="https://salt.tikicdn.com/cache/w100/ts/product/39/9b/d0/a5c44dbaa5e13ab1a79a83d86c5b4730.jpg"
									alt="Image..."
									sx={{
										width: '80px',
										height: '50px',
										borderRadius: '35%',
										marginRight: '15px',
									}}
								/>
								<Name title="zxc">zxc</Name>
							</Category>
						</Link>
					</Grid>
				</RootStyle>
			</ToggleShowAll>
		</Box>
	);
};

const RootStyle = styled(Grid)(({ theme }) => ({
	padding: '0 50px',
	marginBottom: '35px',
	maxHeight: '180px',
	overflowY: 'hidden',
	transition: 'all 0.5s',
	[theme.breakpoints.down('sm')]: {
		padding: 0,
	},
}));

const Category = styled('div')(({ theme }) => ({
	display: 'flex',
	justifyContent: 'space-around',
	alignItems: 'center',
	padding: '10px',
	margin: '2px',
	backgroundColor: theme.palette.background.paper,
	border: '1px solid rgba(0,0,0,0.10)',
	borderRadius: '5px',
	cursor: 'pointer',
	'&:hover': {
		boxShadow: '5px 3px 7px rgb(145 158 171 / 24%)',
	},
}));

const Name = styled('span')({
	width: '100%',
	fontSize: '14px',
	fontWeight: '400',
	display: '-webkit-box',
	WebkitLineClamp: 2,
	WebkitBoxOrient: 'vertical',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	'&:hover': {
		color: '#f53d2d',
	},
});

Categories.propTypes = propTypes;

export default Categories;
