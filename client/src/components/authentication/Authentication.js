import { useState, useReducer, Fragment } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// apis
import accountApi from '../../apis/accountApi';
// hooks
import useModal from '../../hooks/useModal';
//
import AuthSocial from './AuthSocial';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const FORM_WIDTH = '500px';

const STATE = {
	authentication: 'authentication',
	login: 'login',
	register: 'register',
};

const initialState = {
	isLoading: false,
	current: STATE.authentication,
	hasError: false,
	errorMessage: '',
};

const handlers = {
	INITIALIZE: (state) => {
		return {
			...state,
			isLoading: false,
			current: STATE.authentication,
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
	SWITCH_STATE: (state, action) => {
		const newState = action.payload;
		return {
			...state,
			isLoading: false,
			current: newState,
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
	VALIDATE: (state, action) => {
		const { hasError, errorMessage } = action.payload;
		return {
			...state,
			hasError,
			errorMessage,
		};
	},
};

const reducer = (state, action) =>
	handlers[action.type] ? handlers[action.type](state, action) : state;

const Authentication = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [phoneNumber, setPhoneNumber] = useState('');
	const { closeModal } = useModal();

	const handleBackDefaultState = () => {
		dispatch({ type: 'INITIALIZE' });
	};
	const handleChangePhoneNumber = (e) => {
		const value = e.target.value;
		setPhoneNumber(value);

		let hasError = false;
		let errorMessage = '';
		if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(value)) {
			hasError = true;
			errorMessage = 'Invalid phone number!';
		}
		dispatch({
			type: 'VALIDATE',
			payload: {
				hasError,
				errorMessage,
			},
		});
	};
	const handleContinue = async () => {
		try {
			dispatch({ type: 'START_LOADING' });
			const accountExists = await accountApi.checkExist(phoneNumber);
			dispatch({
				type: 'SWITCH_STATE',
				payload: accountExists ? STATE.login : STATE.register,
			});
		} catch (error) {
			dispatch({
				type: 'HAS_ERROR',
				payload: error.response.statusText,
			});
		}
	};
	return (
		<RootStyle direction="row">
			<CloseButton onClick={closeModal}>X</CloseButton>
			<LeftContent spacing={5}>
				{state.current === STATE.authentication && (
					<Fragment>
						<Stack spacing={2}>
							<Typography variant="h4">Hello,</Typography>
							<Typography variant="body1">Sign in or Sign up</Typography>
							<TextField
								fullWidth
								label="Phone number"
								variant="standard"
								color="success"
								value={phoneNumber}
								onChange={handleChangePhoneNumber}
								error={state.hasError}
								helperText={state.hasError && state.errorMessage}
							/>
							<LoadingButton loading={state.isLoading} variant="contained" color="error" onClick={handleContinue}>
								Continue
							</LoadingButton>
						</Stack>
						<AuthSocial />
					</Fragment>
				)}
				{state.current === STATE.login && (
					<LoginForm
						phoneNumber={phoneNumber}
						handleBackDefaultState={handleBackDefaultState}
						closeModal={closeModal}
					/>
				)}
				{state.current === STATE.register && (
					<RegisterForm phoneNumber={phoneNumber} handleBackDefaultState={handleBackDefaultState} />
				)}
			</LeftContent>
			<RightContent justifyContent="center" alignItems="center">
				<Typography variant="subtitle2">Shopping at Tipe</Typography>
				<Typography variant="body2">Super deals every day</Typography>
			</RightContent>
		</RootStyle>
	);
};

const RootStyle = styled(Stack)({
	width: '800px',
	position: 'relative',
});

const CloseButton = styled(Typography)(({ theme }) => ({
	position: 'absolute',
	top: '5px',
	right: '5px',
	width: '30px',
	height: '30px',
	lineHeight: '30px',
	borderRadius: '15px',
	textAlign: 'center',
	cursor: 'pointer',
	backgroundColor: theme.palette.background.paper,
	'&:hover': {
		backgroundColor: theme.palette.error.main,
		color: '#fff',
		transition: '0.2s',
	},
}));

const LeftContent = styled(Stack)({
	width: FORM_WIDTH,
	padding: '40px',
});

const RightContent = styled(Stack)(({ theme }) => ({
	width: `calc(100% - ${FORM_WIDTH})`,
	background: `linear-gradient(136deg, rgb(255 164 140 / 11%), ${theme.palette.error.lighter})`,
	color: theme.palette.error.main,
}));

export default Authentication;
