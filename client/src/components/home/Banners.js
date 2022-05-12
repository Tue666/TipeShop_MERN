import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

import Carousel from '../_external_/slick-carousel/Carousel';
import { settingBanners } from '../_external_/slick-carousel/Settings';

const banners = [
	'https://channel.mediacdn.vn/thumb_w/640/prupload/879/2018/11/img20181130185725670.jpg',
	'https://image-us.eva.vn/upload/4-2018/images/2018-12-11/1-1544521514-549-width660height408.jpg',
	'https://product.hstatic.net/1000238589/product/shopee-640x360_24e81237c35b4081a16ee257790400bb_e268971403d94e62a191a17e14a5c144.jpg',
	'https://cdn.123job.vn/123job//uploads/images/flash%20sale.jpg',
];

const propTypes = {
	id: PropTypes.string,
};

const Banners = ({ id }) => (
	<Grid container id={id}>
		<Grid item md={8} sm={6} xs={12}>
			<Carousel settings={settingBanners}>
				{banners.map((image, index) => (
					<Banner key={index} src={image} alt="" />
				))}
			</Carousel>
		</Grid>
		<Grid item md={4} sm={6} xs={12}>
			<Banner
				src="https://doopage.com/assets/uploads/2019/05/dau-tu-hinh-anh-khi-ban-hang-tren-shopee.jpg"
				alt=""
			/>
		</Grid>
		<Grid item md={6} sm={6} xs={12}>
			<MiniBanner
				src="https://daygiare.com/public/storage/photo/2019/10/16/shopee-20-10-flashsale-giam-toi-50-re-vo-dich-danh-cho-nang-0.jpeg"
				alt=""
			/>
		</Grid>
		<Grid item md={6} sm={6} xs={12}>
			<MiniBanner
				src="http://shopeeplus.com//upload/images/ma-giam-gia-shopee-01-1559789397.jpg"
				alt=""
			/>
		</Grid>
	</Grid>
);

const Banner = styled('img')(({ theme }) => ({
	width: '100%',
	height: '400px',
	padding: '1px',
	[theme.breakpoints.down('sm')]: {
		height: '280px',
	},
}));

const MiniBanner = styled('img')({
	width: '100%',
	height: '150px',
	padding: '1px',
});

Banners.propTypes = propTypes;

export default Banners;
