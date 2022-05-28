import { string, number, func } from 'prop-types';
import { styled } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';

const propTypes = {
	input: string,
	remaining: number,
	handlePrepareInput: func,
};

const QuantityInput = ({ input, remaining, handlePrepareInput }) => {
	const buttonStyle = {
		cursor: 'pointer',
		width: '30px',
		'&:hover': {
			border: '1px solid #2195F3',
		},
		'&.warning:hover': {
			border: '1px solid #F53D2D',
		},
	};

	const handleInputChange = (e) => {
		let value = e.target.value;
		if (!/^\d+$/.test(value)) return;
		if (value === '0') value = '1';
		handlePrepareInput(parseInt(value));
	};
	const handleDecreaseInput = () => {
		const newInput = parseInt(input) - 1;
		handlePrepareInput(newInput);
	};
	const handleIncreaseInput = () => {
		const newInput = parseInt(input) + 1;
		handlePrepareInput(newInput);
	};
	return (
		<Stack>
			<Stack direction="row" alignItems="center">
				<BoxStyled
					className={parseInt(input) <= 1 ? 'warning' : ''}
					component="button"
					onClick={handleDecreaseInput}
					sx={buttonStyle}
				>
					-
				</BoxStyled>
				<BoxStyled
					component="input"
					type="text"
					value={input}
					onChange={handleInputChange}
					sx={{ width: '40px' }}
				/>
				<BoxStyled component="button" onClick={handleIncreaseInput} sx={buttonStyle}>
					+
				</BoxStyled>
			</Stack>
			{remaining <= 5 && (
				<Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
					{remaining} product(s) left
				</Typography>
			)}
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

QuantityInput.propTypes = propTypes;

export default QuantityInput;
