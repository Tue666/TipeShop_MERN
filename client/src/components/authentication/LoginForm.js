import { string, func } from 'prop-types';
import { Stack, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowBackIosOutlined } from '@mui/icons-material';

const propTypes = {
	phoneNumber: string,
	handleBackDefaultState: func,
};

const LoginForm = ({ phoneNumber, handleBackDefaultState }) => {
	const handleSignIn = () => {
		console.log(phoneNumber);
	};
	return (
		<Stack spacing={3}>
			<ArrowBackIosOutlined sx={{ cursor: 'pointer' }} onClick={handleBackDefaultState} />
			<div>
				<Typography variant="h6">Enter password</Typography>
				<Typography variant="body2">
					Please enter Tipe password of phone number <strong>0586181641</strong>
				</Typography>
			</div>
			<TextField fullWidth label="Password" variant="standard" />
			<LoadingButton loading={false} variant="contained" color="error" onClick={handleSignIn}>
				Sign in
			</LoadingButton>
		</Stack>
	);
};

LoginForm.propTypes = propTypes;

export default LoginForm;
