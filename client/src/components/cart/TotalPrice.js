import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Stack, Typography, Link, Divider, Button } from '@mui/material';

// utils
import { toVND } from '../../utils/formatMoney';
// constant
import { HEADER_HEIGHT, CART_PAGE } from '../../constant';

const TotalPrice = () => {
	return (
		<RootStyle>
			<ContentInner>
				<Wrapper>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="subtitle2">Ship Address</Typography>
						<Linking component={RouterLink} to="/">
							Change
						</Linking>
					</Stack>
					<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
						Pihe | 0586181641
					</Typography>
					<Typography variant="body2">Chùa liên trì, Xã Suối Cao, Huyện Xuân Lộc, Đồng Nai</Typography>
				</Wrapper>
				<Wrapper>
					<Typography variant="subtitle2">Coupon tickets</Typography>
					<Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'rgb(26 139 237)' }}>
						<i className="bi bi-ticket-detailed"></i> Select or enter coupon code
					</Typography>
				</Wrapper>
				<Wrapper>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="subtitle2">Guess</Typography>
						<Typography variant="subtitle1">{toVND(1)}</Typography>
					</Stack>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="subtitle2">Coupon</Typography>
						<Typography variant="subtitle1">- {toVND(0)}</Typography>
					</Stack>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="subtitle2">Ship Fee</Typography>
						<Typography variant="subtitle1">+ {toVND(0)}</Typography>
					</Stack>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="subtitle2">Freeship</Typography>
						<Typography variant="subtitle1">- {toVND(0)}</Typography>
					</Stack>
					<Divider />
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="subtitle2">Total</Typography>
						<Stack alignItems="end">
							<Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
								Choose a product, please!
							</Typography>
							<Typography variant="caption">(VAT includes)</Typography>
						</Stack>
					</Stack>
				</Wrapper>
				<Button variant="contained" color="error" sx={{ width: '100%' }}>
					Check out (0)
				</Button>
			</ContentInner>
		</RootStyle>
	);
};

const RootStyle = styled('div')(({ theme }) => ({
	width: `calc(100% - calc(${CART_PAGE.CART_LIST_WIDTH} + 15px))`,
	[theme.breakpoints.down('md')]: {
		width: '100%',
	},
}));

const ContentInner = styled('div')({
	position: 'sticky',
	top: `calc(${HEADER_HEIGHT} + 10px)`,
});

const Wrapper = styled('div')(({ theme }) => ({
	padding: '10px',
	marginBottom: '10px',
	backgroundColor: theme.palette.background.paper,
	fontSize: '14px',
}));

const Linking = styled(Link)({
	color: 'rgb(26 139 237)',
	cursor: 'pointer',
	textDecoration: 'none',
	fontWeight: '500',
});

export default TotalPrice;
