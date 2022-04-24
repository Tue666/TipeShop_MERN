import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const propTypes = {
	sx: PropTypes.object,
};

const SearchBar = ({ sx }) => (
	<Box sx={{ position: 'relative', height: 40, ...sx }}>
		<SearchField placeholder="Enter what are you looking for here ... <3" />
		<SearchButton>
			<i className="bi bi-search"></i>
		</SearchButton>
	</Box>
);

const SearchField = styled('input')(({ theme }) => ({
	width: '100%',
	height: '100%',
	backgroundColor: theme.palette.background.default,
	color: theme.palette.text.primary,
	outline: 'none',
	border: 'none',
	padding: '0 50px 0 20px',
	borderRadius: 20,
}));

const SearchButton = styled('div')(({ theme }) => ({
	position: 'absolute',
	top: 5,
	right: 5,
	width: 30,
	height: 30,
	lineHeight: '30px',
	outline: 'none',
	border: 'none',
	borderRadius: '50%',
	backgroundColor: theme.palette.error.light,
	color: '#fff',
	transition: '0.3s',
	cursor: 'pointer',
	textAlign: 'center',
	'&:hover': {
		backgroundColor: theme.palette.error.main,
		transform: 'scale(1.1)',
	},
}));

SearchBar.propTypes = propTypes;

export default SearchBar;
