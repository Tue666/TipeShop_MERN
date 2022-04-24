const GlobalStyles = (theme) => {
	const styles = {
		html: {
			scrollBehavior: 'smooth',
		},
		'::-webkit-scrollbar': {
			width: '11px',
			height: '11px',
		},
		'::-webkit-scrollbar-thumb': {
			background: 'gray',
			borderRadius: '10px',
			border: `2px solid ${theme.palette.background.default}`,
		},
		'::-webkit-scrollbar-thumb:hover': {
			backgroundColor: '#bbb',
		},
		'*': {
			margin: 0,
			padding: 0,
			boxSizing: 'border-box',
			fontFamily: 'Quicksand',
			listStyle: 'none',
		},
		a: {
			textDecoration: 'none',
			color: theme.palette.text.primary,
		},
		'.slick-slider:hover button': {
			opacity: 1,
		},
		'.slick-arrow:before': {
			display: 'none',
		},
		'.slick-dots li.slick-active div': {
			backgroundColor: theme.palette.error.main,
		},
	};
	return styles;
};

export default GlobalStyles;
