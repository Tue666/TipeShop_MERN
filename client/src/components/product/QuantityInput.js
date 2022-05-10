import { styled } from '@mui/material/styles';
import { Stack, Box, Typography, Button } from '@mui/material';

const QuantityInput = () => {
	const buttonStyle = {
		cursor: 'pointer',
		width: '30px',
		'&.disabled': {
			pointerEvents: 'none !important',
		},
		'&:hover': {
			border: '1px solid #2195f3',
		},
	};
	return (
		<Stack spacing={1}>
			<Typography variant="subtitle2">Quantity</Typography>
			<Stack direction="row" alignItems="center">
				<BoxStyled component="button" sx={buttonStyle}>
					-
				</BoxStyled>
				<BoxStyled component="input" type="text" value="1" onChange={() => {}} sx={{ width: '40px' }} />
				<BoxStyled component="button" sx={buttonStyle}>
					+
				</BoxStyled>
			</Stack>
			<Button variant="contained" color="error" sx={{ width: '50%' }}>
				BUY
			</Button>
		</Stack>
	);
};

const BoxStyled = styled(Box)(({ theme }) => ({
	height: '30px',
	fontSize: '14px',
	textAlign: 'center',
	outline: 'none',
	transition: 'border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s',
	border: `1px solid ${theme.palette.background.default}`,
	backgroundColor: theme.palette.background.paper,
	color: theme.palette.text.primary,
}));

export default QuantityInput;
