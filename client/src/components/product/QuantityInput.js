import { func } from 'prop-types';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Box, Typography, Button } from '@mui/material';

const propTypes = {
	handleAddToCart: func,
};

const QuantityInput = ({ handleAddToCart }) => {
	const [input, setInput] = useState('1');
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

	const handleInputBlur = (e) => {
		const value = e.target.value;
		if (value === '') setInput('1');
	};
	const handleInputChange = (e) => {
		let value = e.target.value;
		if (!/^\d*$/.test(value)) return;
		if (value === '0') value = '1';
		setInput(value);
	};
	const handleDecreaseInput = () => {
		const newInput = parseInt(input) - 1;
		if (newInput < 1) return;
		setInput(newInput.toString());
	};
	const handleIncreaseInput = () => {
		const newInput = parseInt(input) + 1;
		setInput(newInput.toString());
	};
	return (
		<Stack spacing={1}>
			<Typography variant="subtitle2">Quantity</Typography>
			<Stack direction="row" alignItems="center">
				<BoxStyled
					component="button"
					className={parseInt(input) <= 1 ? 'disabled' : ''}
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
					onBlur={handleInputBlur}
					sx={{ width: '40px' }}
				/>
				<BoxStyled component="button" onClick={handleIncreaseInput} sx={buttonStyle}>
					+
				</BoxStyled>
			</Stack>
			<Button
				variant="contained"
				color="error"
				onClick={() => handleAddToCart(parseInt(input))}
				disableElevation
				sx={{ width: '50%' }}
			>
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

QuantityInput.propTypes = propTypes;

export default QuantityInput;
