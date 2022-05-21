import { useState, Fragment } from 'react';
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

const Authentication = () => {
	const [phoneNumber, setPhoneNumber] = useState('');
	const [state, setState] = useState({
		isLoading: false,
		current: STATE.register,
		hasError: false,
		errorMessage: '',
	});
	const { closeModal } = useModal();

	const handleBackDefaultState = () => {
		setState({
			isLoading: false,
			current: STATE.authentication,
			hasError: false,
			errorMessage: '',
		});
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
		setState({
			...state,
			hasError,
			errorMessage,
		});
	};
	const handleContinue = async () => {
		try {
			setState({
				...state,
				isLoading: true,
			});
			const accountExists = await accountApi.checkExist(phoneNumber);
			setState({
				...state,
				isLoading: false,
				current: accountExists ? STATE.login : STATE.register,
			});
		} catch (error) {
			setState({
				...state,
				isLoading: false,
				hasError: true,
				errorMessage: error.response.statusText,
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
					<LoginForm phoneNumber={phoneNumber} handleBackDefaultState={handleBackDefaultState} />
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
