import { styled } from '@mui/material/styles';
import { ArrowBackIosOutlined, ArrowForwardIosOutlined } from '@mui/icons-material';

// Banners
const BannerArrow = styled('button')(({ side }) => ({
	width: '50px',
	height: '100%',
	backgroundColor: 'rgba(0,0,0,0.1)',
	position: 'absolute',
	bottom: '0',
	left: side === 'back' ? 0 : 'calc(100% - 50px)',
	outline: 'none',
	border: 'none',
	zIndex: 99,
	opacity: 0,
	transition: '0.3s',
	cursor: 'pointer',
	'&:hover': {
		backgroundColor: 'rgba(255,255,255,0.3)',
		color: 'rgba(255,255,255,0.8)',
	},
}));
const CustomeBannerArrow = ({ currentSlide, slideCount, side, children, ...props }) => {
	return (
		<BannerArrow side={side} {...props}>
			{children}
		</BannerArrow>
	);
};

const AppendDots = styled('ul')({
	display: 'flex',
	position: 'absolute',
	left: 'calc(50% - 25px)',
	bottom: '20px',
});

const Paging = styled('div')({
	width: '10px',
	height: '10px',
	borderRadius: '50%',
	margin: '0 5px',
	backgroundColor: 'rgba(255,255,255,0.6)',
	cursor: 'pointer',
});
export const settingBanners = {
	dots: true,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 2500,
	prevArrow: (
		<CustomeBannerArrow side="back">
			<ArrowBackIosOutlined />
		</CustomeBannerArrow>
	),
	nextArrow: (
		<CustomeBannerArrow side="forward">
			<ArrowForwardIosOutlined />
		</CustomeBannerArrow>
	),
	appendDots: (dots) => <AppendDots>{dots}</AppendDots>,
	customPaging: (i) => <Paging />,
};

// Product Section
const SectionArrow = styled('button')(({ theme, side }) => ({
	width: '40px',
	height: '40px',
	borderRadius: '50%',
	backgroundColor: 'rgba(255,255,255,0.9)',
	boxShadow: '0px 3px 5px rgb(1 1 1 / 15%)',
	position: 'absolute',
	top: 'calc(50% - 25px)',
	left: side === 'back' ? '-20px' : 'calc(100% - 20px)',
	outline: 'none',
	border: 'none',
	zIndex: 99,
	opacity: 0,
	transition: '0.3s',
	cursor: 'pointer',
	color: '#000000',
	'&:hover': {
		backgroundColor: theme.palette.error.main,
		color: '#fff',
		boxShadow: `0px 2px 5px ${theme.palette.error.light}`,
	},
}));
const CustomeSectionArrow = ({ currentSlide, slideCount, side, children, ...props }) => {
	return (
		<SectionArrow side={side} {...props}>
			{children}
		</SectionArrow>
	);
};

export const settingProductSection = {
	className: 'slider variable-width',
	variableWidth: true,
	infinite: true,
	speed: 500,
	slidesToShow: 4,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 2500,
	prevArrow: (
		<CustomeSectionArrow side="back">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				className="bi bi-chevron-left"
				viewBox="0 0 16 16"
			>
				<path
					fillRule="evenodd"
					d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
				/>
			</svg>
		</CustomeSectionArrow>
	),
	nextArrow: (
		<CustomeSectionArrow side="forward">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				className="bi bi-chevron-right"
				viewBox="0 0 16 16"
			>
				<path
					fillRule="evenodd"
					d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
				/>
			</svg>
		</CustomeSectionArrow>
	),
	responsive: [
		{
			breakpoint: 1080,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
			},
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
			},
		},
	],
};
