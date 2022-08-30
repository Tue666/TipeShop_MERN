import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography, Skeleton, Tooltip } from '@mui/material';

// apis
import categoryApi from '../../apis/categoryApi';
// components
import ImageLoader from '../ImageLoader';
// utils
import { distinguishImage } from '../../utils/formatImage';

const propTypes = {
	id: PropTypes.string,
	title: PropTypes.string,
};

const Categories = ({ id, title }) => {
	const [categories, setCategories] = useState(null);
	useEffect(() => {
		const getCategories = async () => {
			let categories = await categoryApi.findAllRoot();
			setCategories(categories);
		};
		getCategories();
	}, []);
	return (
		<Box id={id}>
			<Typography variant="h6">{title}</Typography>
			<RootStyle container justifyContent="center">
				{categories &&
					categories.map((category) => {
						const { _id, name, image, slug } = category;
						return (
							<Grid item lg={2} sm={3} xs={6} key={_id}>
								<Link to={`/${slug}/cid${_id}`}>
									<Category>
										<ImageLoader
											src={distinguishImage(image)}
											alt={name}
											sx={{
												width: '50px',
												height: '50px',
												borderRadius: '50%',
												marginRight: '15px',
												flexShrink: 0,
											}}
										/>
										<Tooltip placement="top" title={name} arrow>
											<Name>{name}</Name>
										</Tooltip>
									</Category>
								</Link>
							</Grid>
						);
					})}
				{!categories &&
					[...Array(12)].map((_, index) => (
						<Grid item lg={2} sm={3} xs={6} key={index}>
							<Category>
								<Skeleton variant="circular" width={49} height={49} />
								<Skeleton variant="rectangular" width={80} height={45} />
							</Category>
						</Grid>
					))}
			</RootStyle>
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
