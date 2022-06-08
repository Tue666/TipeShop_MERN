import { string, func } from 'prop-types';
import { useState, useReducer } from 'react';
import { Stack, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowBackIosOutlined } from '@mui/icons-material';

// utils
import enqueueSnackbar from '../../utils/snackbar';

const initialState = {
	isLoading: false,
	hasError: false,
	errorMessage: '',
};

const handlers = {
	RESET: (state) => {
		return {
			...state,
			isLoading: false,
			hasError: false,
			errorMessage: '',
		};
	},
	START_LOADING: (state) => {
		return {
			...state,
			isLoading: true,
		};
	},
	HAS_ERROR: (state, action) => {
		const errorMessage = action.payload;
		return {
			...state,
			isLoading: false,
			hasError: true,
			errorMessage,
		};
	},
};

const reducer = (state, action) =>
	handlers[action.type] ? handlers[action.type](state, action) : state;

const propTypes = {
	phoneNumber: string,
	handleBackDefaultState: func,
	login: func,
	closeModal: func,
};

const LoginForm = ({ phoneNumber, handleBackDefaultState, login, closeModal }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [password, setPassword] = useState('');
	const handleSignIn = async () => {
		try {
			dispatch({ type: 'START_LOADING' });
			const name = await login(phoneNumber, password);
			enqueueSnackbar(`Welcome ${name}, happy shopping with Tipe.`, {
				variant: 'success',
				anchorOrigin: {
					vertical: 'bottom',
					horizontal: 'center',
				},
			});
			closeModal();
		} catch (error) {
			dispatch({
				type: 'HAS_ERROR',
				payload: error.response.statusText,
			});
		}
	};
	return (
		<Stack spacing={3}>
			<ArrowBackIosOutlined sx={{ cursor: 'pointer' }} onClick={() => handleBackDefaultState()} />
			<div>
				<Typography variant="h6">Enter password</Typography>
				<Typography variant="body2">
					Please enter Tipe password of phone number <strong>{phoneNumber}</strong>
				</Typography>
			</div>
			<TextField
				fullWidth
				label="Password"
				variant="standard"
				color="success"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				onClick={() => dispatch({ type: 'RESET' })}
				error={state.hasError}
				helperText={state.hasError && state.errorMessage}
			/>
			<LoadingButton
				loading={state.isLoading}
				variant="contained"
				color="error"
				disableElevation
				onClick={handleSignIn}
			>
				Sign in
			</LoadingButton>
		</Stack>
	);
};

LoginForm.propTypes = propTypes;

export default LoginForm;
