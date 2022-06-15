import { shape, bool } from 'prop-types';
import { useState, useReducer, Fragment } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// apis
import accountApi from '../../apis/accountApi';
// components
import ImageLoader from '../ImageLoader';
import Avatar from '../Avatar';
// hooks
import useModal from '../../hooks/useModal';
import useAuth from '../../hooks/useAuth';
// config
import { apiConfig } from '../../config';
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
	socialAccount: null,
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
	FETCH_SOCIAL_ACCOUNT: (state, action) => {
		const account = action.payload;
		return {
			...state,
			socialAccount: account,
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

const propTypes = {
	params: shape({
		beClosed: bool,
	}),
};

const Authentication = ({ params }) => {
	const { beClosed } = params;
	const [state, dispatch] = useReducer(reducer, initialState);
	const [phoneNumber, setPhoneNumber] = useState('');
	const { closeModal } = useModal();
	const { login, socialLogin, register } = useAuth();

	const handleBackDefaultState = (socialAccount = null) => {
		if (socialAccount) dispatch({ type: 'FETCH_SOCIAL_ACCOUNT', payload: socialAccount });
		else dispatch({ type: 'INITIALIZE' });
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
			if (accountExists) {
				if (state.socialAccount) {
					dispatch({
						type: 'HAS_ERROR',
						payload: 'Phone number registered account',
					});
					return;
				}
				dispatch({
					type: 'SWITCH_STATE',
					payload: STATE.login,
				});
			} else {
				// Send phone verify goes here...
				dispatch({
					type: 'SWITCH_STATE',
					payload: STATE.register,
				});
			}
		} catch (error) {
			dispatch({
				type: 'HAS_ERROR',
				payload: error.response.statusText,
			});
		}
	};
	return (
		<RootStyle direction="row">
			{beClosed && <CloseButton onClick={closeModal}>X</CloseButton>}
			<LeftContent spacing={5}>
				{state.current === STATE.authentication && (
					<Fragment>
						<Stack spacing={2}>
							<Typography variant="h4">Hello,</Typography>
							{state.socialAccount && (
								<Stack alignItems="center" spacing={1}>
									<Avatar
										name={state.socialAccount.name}
										src={state.socialAccount.avatar_url}
										sx={{ width: '100px', height: '100px' }}
									/>
									<Typography variant="body1" sx={{ fontWeight: 'bold' }}>
										{state.socialAccount.name}
									</Typography>
								</Stack>
							)}
							{!state.socialAccount && <Typography variant="body1">Sign in or Sign up</Typography>}
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
							<LoadingButton
								loading={state.isLoading}
								variant="contained"
								color="error"
								disableElevation
								onClick={handleContinue}
							>
								Continue
							</LoadingButton>
						</Stack>
						{!state.socialAccount && (
							<AuthSocial
								handleBackDefaultState={handleBackDefaultState}
								socialLogin={socialLogin}
								closeModal={closeModal}
							/>
						)}
					</Fragment>
				)}
				{state.current === STATE.login && (
					<LoginForm
						phoneNumber={phoneNumber}
						handleBackDefaultState={handleBackDefaultState}
						login={login}
						closeModal={closeModal}
					/>
				)}
				{state.current === STATE.register && (
					<RegisterForm
						phoneNumber={phoneNumber}
						socialAccount={state.socialAccount}
						handleBackDefaultState={handleBackDefaultState}
						register={register}
						closeModal={closeModal}
					/>
				)}
			</LeftContent>
			<RightContent justifyContent="center" alignItems="center">
				<ImageLoader
					src={`${apiConfig.image_url}/_external_/buy_more.png`}
					alt="buy_more"
					sx={{ width: '190px', height: '160px' }}
				/>
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

Authentication.propTypes = propTypes;

export default Authentication;
