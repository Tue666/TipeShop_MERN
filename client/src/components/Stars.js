import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { StarRounded, StarHalfRounded } from '@mui/icons-material';

const propTypes = {
	total: PropTypes.number,
	rating: PropTypes.number,
};

const Stars = ({ total, rating, sx }) => (
	<div>
		{[...Array(total)].map((e, i) => (
			<Fragment key={i}>
				{i + 1 <= Math.floor(rating) ? (
					<StarRounded sx={{ ...sx, color: 'warning.main' }} fontSize="small" />
				) : i + 1 - rating >= 0.35 && i + 1 - rating <= 0.65 ? (
					<StarHalfRounded sx={{ ...sx, color: 'warning.main' }} fontSize="small" />
				) : (
					<StarRounded sx={{ ...sx, color: 'rgb(199, 199, 199)' }} fontSize="small" />
				)}
			</Fragment>
		))}
	</div>
);

Stars.propTypes = propTypes;

export default Stars;
