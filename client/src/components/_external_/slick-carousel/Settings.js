import { styled } from '@mui/material/styles';
import {
	ArrowBackIosOutlined,
	ArrowForwardIosOutlined,
	NavigateBefore,
	NavigateNext,
} from '@mui/icons-material';

// Banners
const BannerArrow = styled('button')(({ side }) => ({
	width: '50px',
	height: '50%',
	backgroundColor: 'rgba(0,0,0,0.1)',
	color: '#fff',
	position: 'absolute',
	bottom: '0',
	left: side === 'back' ? 0 : 'calc(100% - 50px)',
	outline: 'none',
	border: 'none',
	zIndex: 99,
	opacity: 0,
	transition: '0.3s',
	cursor: 'pointer',
	clipPath: `polygon(${
		side === 'back'
			? '70% 0, 100% 10%, 100% 90%, 70% 100%, 0 100%, 0 0'
			: '30% 0, 100% 0, 100% 100%, 30% 100%, 0 90%, 0 10%'
	})`,
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
	justifyContent: 'end',
	alignItems: 'center',
	position: 'absolute',
	right: '20px',
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
	autoplaySpeed: 6000,
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
	color: '#000000',
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
	autoplaySpeed: 6000,
	prevArrow: (
		<CustomeSectionArrow side="back">
			<NavigateBefore />
		</CustomeSectionArrow>
	),
	nextArrow: (
		<CustomeSectionArrow side="forward">
			<NavigateNext />
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
