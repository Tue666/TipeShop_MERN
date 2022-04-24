import { styled } from '@mui/material/styles';
import { Box, Stack, Typography, Divider } from '@mui/material';

const CUSTOMER_SUPPORT = [
	'Hotline: 1999-9999 (1000 VND/minute, 8-21 hours including Saturday and Sunday)',
	'Frequently asked Questions',
	'Submit a support request',
	'Ordering guide',
	'Shipping method',
	'Return Policy',
	'Installment Instructions',
	'Import policy',
];

const SHOP = [
	'About shop',
	'Recruitment',
	'Payment Privacy Policy',
	'Privacy policy of personal information',
	'Complaint handling policy',
	'Terms of use',
];

const PAYMENT_METHODS = [
	{ image: 'https://thuthuatmaytinh.vn/wp-content/uploads/2019/02/ZaloPay-logo.png' },
	{ image: 'https://seeklogo.com/images/V/visa-logo-121ECA05B2-seeklogo.com.png' },
	{
		image:
			'https://4.bp.blogspot.com/-ItRaVmM-PoU/XgrlppcnvcI/AAAAAAAABPY/Pbgwlu9Gb7UKLJFekuqk5__OPWQvqq08gCLcBGAsYHQ/s200-c/shopee%2B1.png',
	},
	{
		image:
			'https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMzhYRHc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--b10722ddd28995368dc1ae4a5e2fac06989e93b7/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDVG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU2RDJKaFkydG5jbTkxYm1SSklnd2pSa1pHUmtaR0Jqc0dWRG9MWlhoMFpXNTBTU0lNTXpBd2VETXdNQVk3QmxRPSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--7d96359076aa1ae3adcce15831d4033d052b9214/cong-ty-cp-cong-ngh-va-d-ch-v-moca-logo.png',
	},
];

const CONNECTS = [
	{
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Facebook_logo_36x36.svg/2048px-Facebook_logo_36x36.svg.png',
	},
	{ image: 'https://assets.materialup.com/uploads/5199f7ce-bb8c-4e39-95b0-5f10b67e8ec4/avatar.jpg' },
	{
		image:
			'https://inkythuatso.com/uploads/thumbnails/800/2021/09/zalo-logo-inkythuatso-14-15-05-01.jpg',
	},
];

const Footer = () => (
	<RootStyle>
		<Stack direction="row" sx={{ flexWrap: 'wrap' }}>
			<Stack sx={{ m: 2, width: '226px' }}>
				<Typography variant="subtitle2" sx={{ py: 1 }}>
					Customer support
				</Typography>
				{CUSTOMER_SUPPORT.map((item, index) => (
					<Typography key={index} variant="caption">
						{item}
					</Typography>
				))}
			</Stack>
			<Stack sx={{ m: 2, width: '226px' }}>
				<Typography variant="subtitle2" sx={{ py: 1 }}>
					Shop
				</Typography>
				{SHOP.map((item, index) => (
					<Typography key={index} variant="caption">
						{item}
					</Typography>
				))}
			</Stack>
			<Stack sx={{ m: 2, width: '226px' }}>
				<Stack>
					<Typography variant="subtitle2" sx={{ py: 1 }}>
						Cooperation and association
					</Typography>
					<Typography variant="caption">Regulations on operation of E-commerce trading floor</Typography>
					<Typography variant="caption">Selling with Tiki</Typography>
				</Stack>
				<Stack>
					<Typography variant="subtitle2" sx={{ py: 1 }}>
						Certified by
					</Typography>
					<Box
						component="img"
						src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong.svg"
						alt=""
						sx={{ width: '83px', height: '32px' }}
					/>
				</Stack>
			</Stack>
			<Stack sx={{ m: 2, width: '226px' }}>
				<Typography variant="subtitle2" sx={{ py: 1 }}>
					Payment methods
				</Typography>
				<StyledGrid>
					{PAYMENT_METHODS.map((item, index) => (
						<Box
							key={index}
							component="img"
							src={item.image}
							alt=""
							sx={{ width: '32px', height: '32px', borderRadius: '10px' }}
						/>
					))}
				</StyledGrid>
			</Stack>
			<Stack sx={{ m: 2, width: '226px' }}>
				<Typography variant="subtitle2" sx={{ py: 1 }}>
					Connect with us
				</Typography>
				<StyledGrid>
					{CONNECTS.map((item, index) => (
						<Box
							key={index}
							component="img"
							src={item.image}
							alt=""
							sx={{ width: '32px', height: '32px', borderRadius: '50%' }}
						/>
					))}
				</StyledGrid>
				<Stack>
					<Typography variant="subtitle2" sx={{ py: 1 }}>
						Download the app
					</Typography>
					<Box
						component="img"
						src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/appstore.png"
						alt=""
						sx={{ width: '122px', height: '36px', borderRadius: '5px' }}
					/>
					<Box
						component="img"
						src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/playstore.png"
						alt=""
						sx={{ width: '122px', height: '36px', borderRadius: '5px', marginTop: '10px' }}
					/>
				</Stack>
			</Stack>
		</Stack>
		<Divider />
		<Stack sx={{ py: 2 }}>
			<Typography variant="caption">
				Office address: abcxyz, Ward 8, Tan Binh District, Ho Chi Minh City
			</Typography>
			<Typography variant="caption">
				Receive online orders and deliver to your door, not yet support to buy and receive goods directly at
				the office or order processing center
			</Typography>
			<Typography variant="caption">
				Business Registration Certificate No. 0309532909 issued by the Department of Planning and Investment
				of Ho Chi Minh City on 06/01/2010
			</Typography>
			<Typography variant="caption">© 2021 - Copyright by abc Joint Stock Company - abc.xyz</Typography>
		</Stack>
		<Divider />
		<Stack sx={{ py: 2 }}>
			<Typography variant="subtitle1" sx={{ py: 1 }}>
				So fast, so good, so cheap
			</Typography>
			<Typography variant="subtitle2">Have everything</Typography>
			<Typography variant="caption">
				With millions of products from reputable brands and stores, thousands of items from Smartphones to
				Fresh Fruits and Vegetables, along with ShopNOW super-fast delivery service, shop brings you a
				shopping experience. online starts with credit. In addition, at shop you can easily use countless
				other utilities such as buying scratch cards, paying electricity and water bills, insurance
				services.
			</Typography>
			<Typography variant="subtitle2">Promotions and offers are overflowing</Typography>
			<Typography variant="caption">
				You want to hunt for a shocking price, Shop has a shocking price every day for you! You are a fan of
				brands, genuine Official stores are waiting for you. No need to hunt for freeship codes, because
				shop already has millions of products in the Freeship+ program, unlimited bookings, saving your
				precious time. Buy more ShopNOW savings packages to receive 100% free shipping 2h same day, or buy
				premium ShopNOW packages to receive 100% freeship, applicable to 100% products, 100% provinces in
				Vietnam. Want to save even more? Already have ShopCARD, shop credit card refund 15% on all
				transactions (maximum refund 600k/month).
			</Typography>
		</Stack>
	</RootStyle>
);

const RootStyle = styled('div')(({ theme }) => ({
	paddingInline: '20px',
	marginTop: '50px',
	backgroundColor: theme.palette.background.paper,
}));

const StyledGrid = styled('div')({
	paddingBlock: '10px',
	display: 'grid',
	gridTemplateColumns: 'repeat(4,1fr)',
	gridGap: '5px',
});

export default Footer;
