import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

// components
import Stars from '../Stars';
import QuantityInput from './QuantityInput';
// constant
import { PRODUCT_PAGE } from '../../constant';

const BODY_INTEND = {
	LEFT_WIDTH: '260px',
};

const Information = () => {
	return (
		<RootStyle>
			<Typography variant="h6">Điện thoại POCO M3 Pro 5G (6GB/128GB) - Hàng chính hãng</Typography>
			<Stack spacing={1}>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Stars total={5} rating={5} sx={{ fontSize: '18px' }} />
					<Typography variant="subtitle1" sx={{ fontSize: '14px', cursor: 'pointer' }}>
						(View 100 reviews)
					</Typography>
					<DivideLine />
					<Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
						657 sold
					</Typography>
				</Stack>
				<Stack direction="row" spacing={1}>
					<Stack spacing={1} sx={{ flex: '1 1 0%' }}>
						<PriceWrapper tag="sale">
							<Typography variant="h4" sx={{ fontWeight: 'bold' }}>
								4.000.000
							</Typography>
							<Typography component="span">
								<Typography
									component="span"
									variant="subtitle1"
									sx={{ color: '#efefef', fontSize: '15px', textDecoration: 'line-through', mx: '5px' }}
								>
									4.400.000
								</Typography>
								-10%
							</Typography>
						</PriceWrapper>
						<QuantityInput />
					</Stack>
					<IntendWrapper>
						<Wrapper>
							<Stack direction="row" justifyContent="space-between">
								<Typography variant="caption">Seller</Typography>
								<Typography variant="subtitle2">Tiki Trading</Typography>
							</Stack>
						</Wrapper>
						<Wrapper>
							<Stack direction="row" justifyContent="space-between" mb={1}>
								<Typography variant="caption">Warranty period</Typography>
								<Typography variant="subtitle2">12-month</Typography>
							</Stack>
							<Stack direction="row" justifyContent="space-between" mb={1}>
								<Typography variant="caption">Warranty form</Typography>
								<Typography variant="subtitle2">Electronic</Typography>
							</Stack>
							<Stack direction="row" justifyContent="space-between" mb={1}>
								<Typography variant="caption">Warranty place</Typography>
								<Typography variant="subtitle2">Seller</Typography>
							</Stack>
						</Wrapper>
						<Wrapper sx={{ display: 'flex' }}>
							<Stack direction="column" alignItems="center" spacing={1} mx={1}>
								<img
									src="https://salt.tikicdn.com/ts/upload/2c/48/44/720434869e103b03aaaf1a104d91ad25.png"
									alt=""
									style={{ width: '32px', height: '32px' }}
								/>
								<Typography sx={{ textAlign: 'center', fontSize: '13px' }}>
									Hoàn tiền <br /> <strong>111%</strong> <br /> nếu hàng giả
								</Typography>
							</Stack>
							<Stack direction="column" alignItems="center" spacing={1} mx={1}>
								<img
									src="https://salt.tikicdn.com/ts/upload/4b/a1/23/1606089d5423e5cba05e3820ad39708e.png"
									alt=""
									style={{ width: '32px', height: '32px' }}
								/>
								<Typography sx={{ textAlign: 'center', fontSize: '13px' }}>
									Mở hộp <br /> kiểm tra <br /> nhận hàng
								</Typography>
							</Stack>
							<Stack direction="column" alignItems="center" spacing={1} mx={1}>
								<img
									src="https://salt.tikicdn.com/ts/upload/63/75/6a/144ada409519d72e2978ad2c61bc02a7.png"
									alt=""
									style={{ width: '32px', height: '32px' }}
								/>
								<Typography sx={{ textAlign: 'center', fontSize: '13px' }}>
									Đổi trả trong <br /> <strong>7 ngày</strong> <br /> nếu sp lỗi
								</Typography>
							</Stack>
						</Wrapper>
					</IntendWrapper>
				</Stack>
			</Stack>
		</RootStyle>
	);
};

const RootStyle = styled('div')(({ theme }) => ({
	width: `calc(100% - ${PRODUCT_PAGE.IMAGE_ZOOM_WIDTH})`,
	padding: '15px',
	[theme.breakpoints.down('sm')]: {
		width: '100%',
	},
}));

const PriceWrapper = styled('div')(({ tag, theme }) => ({
	background: `${
		tag === 'sale'
			? 'linear-gradient(100deg,rgb(255, 66, 78),rgb(253, 130, 10))'
			: theme.palette.background.default
	}`,
	borderRadius: '5px',
	padding: '15px',
	marginBottom: '10px',
	color: `${tag === 'sale' ? '#fff' : '#000000'}`,
}));

const DivideLine = styled('div')({
	width: '1px',
	height: '12px',
	backgroundColor: 'rgb(199, 199, 199)',
});

const IntendWrapper = styled('div')(({ theme }) => ({
	width: BODY_INTEND.LEFT_WIDTH,
	borderRadius: '10px',
	border: `1px solid ${theme.palette.background.default}`,
}));

const Wrapper = styled('div')(({ theme }) => ({
	padding: '10px',
	'&:not(:last-child)': {
		borderBottom: `1px solid ${theme.palette.background.default}`,
	},
}));

export default Information;
