import { styled } from '@mui/material/styles';
import { Stepper, Step, StepLabel, Tooltip, Box } from '@mui/material';

// components
import Logo from '../../components/Logo';
// routes
import { PATH_CHECKOUT } from '../../routes/path';
// constant
import { HEADER_HEIGHT, MAIN_PADDING } from '../../constant';

const STEPS = ['Sign in', 'Delivery address', 'Order & Payment'];

const Header = () => {
	const step = window.location.pathname;
	return (
		<RootStyle>
			<Logo sx={{ flex: '1 1 0%' }} />
			<Stepper
				activeStep={step === PATH_CHECKOUT.shipping ? 1 : step === PATH_CHECKOUT.payment ? 2 : 0}
				alternativeLabel
				sx={{ flex: '4 1 0%' }}
			>
				{STEPS.map((label) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
			<Tooltip placement="bottom" title="Cre from Tiki :D" arrow sx={{ flex: '1 1 0%' }}>
				<Box
					component="img"
					alt="Tiki hotline"
					src="https://frontend.tikicdn.com/_desktop-next/static/img/hotline.png"
					sx={{ width: '176px', height: '42px' }}
				/>
			</Tooltip>
		</RootStyle>
	);
};

const RootStyle = styled('div')(({ theme }) => ({
	height: HEADER_HEIGHT,
	display: 'flex',
	alignItems: 'center',
	padding: MAIN_PADDING,
	backgroundColor: theme.palette.background.paper,
	[theme.breakpoints.down('sm')]: {
		padding: '5px',
	},
}));

export default Header;
