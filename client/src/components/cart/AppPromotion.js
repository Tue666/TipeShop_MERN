import { styled } from '@mui/material/styles';
import { Stack, Typography, TextField, InputAdornment, Button } from '@mui/material';
import { Close, ConfirmationNumberOutlined, Send } from '@mui/icons-material';

// hooks
import useModal from '../../hooks/useModal';

const CODE = {
	WIDTH: '100%',
	HEIGHT: '132px',
};

const CodeBackground = (
	<svg
		viewBox="0 0 431 132"
		style={{
			width: CODE.WIDTH,
			height: CODE.HEIGHT,
			filter: 'drop-shadow(rgba(0, 0, 0, 0.15) 0px 1px 3px)',
		}}
	>
		<g fill="none" fillRule="evenodd">
			<g>
				<g>
					<g>
						<g>
							<g>
								<g transform="translate(-3160 -2828) translate(3118 80) translate(42 2487) translate(0 140) translate(0 85) translate(0 36)">
									<path
										fill="#FFF"
										d="M423 0c4.418 0 8 3.582 8 8v116c0 4.418-3.582 8-8 8H140.5c0-4.419-3.582-8-8-8s-8 3.581-8 8H8c-4.418 0-8-3.582-8-8V8c0-4.418 3.582-8 8-8h116.5c0 4.418 3.582 8 8 8s8-3.582 8-8H392z"
									></path>
									<g stroke="#EEE" strokeDasharray="2 4" strokeLinecap="square" mask="url(#14s2l20tnb)">
										<path d="M0.5 0L0.5 114" transform="translate(132 11)"></path>
									</g>
								</g>
							</g>
						</g>
					</g>
				</g>
			</g>
		</g>
	</svg>
);

const AppPromotion = () => {
	const { closeModal } = useModal();
	return (
		<RootStyle p={2} spacing={2}>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
					Tipe Promotion
				</Typography>
				<Close onClick={closeModal} sx={{ cursor: 'pointer' }} />
			</Stack>
			<Stack direction="row" spacing={1}>
				<TextField
					fullWidth
					label="Enter discount code"
					size="small"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<ConfirmationNumberOutlined />
							</InputAdornment>
						),
					}}
				/>
				<Button disabled variant="contained" disableElevation endIcon={<Send />}>
					APPLY
				</Button>
			</Stack>
			<Scroll>
				<Stack>
					<Typography variant="subtitle2">Discount code</Typography>
				</Stack>
				<Stack spacing={2}>
					{[...Array(5)].map((_, index) => (
						<CodeItem key={index}>
							{CodeBackground}
							<CodeContent direction="row">
								<Stack justifyContent="center" alignItems="center" p={1} sx={{ width: '132px' }}>
									zbxc
								</Stack>
								<Stack justifyContent="center" alignItems="center" p={1} sx={{ flexGrow: 1 }}>
									qưhdajksncjzxnckj
								</Stack>
							</CodeContent>
						</CodeItem>
					))}
				</Stack>
			</Scroll>
		</RootStyle>
	);
};

const RootStyle = styled(Stack)(({ theme }) => ({
	width: '480px',
	position: 'relative',
	backgroundColor: theme.palette.background.paper,
}));

const Scroll = styled('div')({
	maxHeight: '425px',
	overflowY: 'scroll',
});

const CodeItem = styled('div')({
	width: CODE.WIDTH,
	height: CODE.HEIGHT,
	position: 'relative',
});

const CodeContent = styled(Stack)({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
});

export default AppPromotion;
