import { func } from 'prop-types';
import { Stack, Box, Divider, Typography, Link } from '@mui/material';
import FacebookLogin from 'react-facebook-login';
import { useGoogleLogin } from '@react-oauth/google';

// apis
import accountApi from '../../apis/accountApi';
// utils
import enqueueSnackbar from '../../utils/snackbar';
// config
import { socialConfig, appConfig } from '../../config';

const propTypes = {
	handleBackDefaultState: func,
	socialLogin: func,
	closeModal: func,
};

const AuthSocial = ({ handleBackDefaultState, socialLogin, closeModal }) => {
	const handleGoogleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			const response = await accountApi.getGoogleProfile(tokenResponse);
			try {
				const { sub } = response;
				const name = await socialLogin({
					id: sub,
				});
				enqueueSnackbar(`Welcome ${name}, happy shopping with Tipe.`, {
					variant: 'success',
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'center',
					},
				});
				closeModal();
			} catch (error) {
				const { sub, email_verified, name, email, picture } = response;
				const socialAccount = {
					name,
					email,
					is_email_verified: email_verified,
					avatar_url: picture,
					social: [
						{
							id: sub,
							type: 'google',
						},
					],
				};
				handleBackDefaultState(socialAccount);
			}
		},
		onError: (errorResponse) => console.log('google error: ', errorResponse),
	});

	const handleFacebookLogin = async (response) => {
		try {
			const { id } = response;
			const name = await socialLogin({
				id,
			});
			enqueueSnackbar(`Welcome ${name}, happy shopping with Tipe.`, {
				variant: 'success',
				anchorOrigin: {
					vertical: 'bottom',
					horizontal: 'center',
				},
			});
			closeModal();
		} catch (error) {
			const { id, name, email, picture } = response;
			const socialAccount = {
				name,
				email,
				avatar_url: picture.data.url,
				social: [
					{
						id,
						type: 'facebook',
					},
				],
			};
			handleBackDefaultState(socialAccount);
		}
	};
	return (
		<Stack spacing={2} alignItems="center">
			<Divider sx={{ width: '100%' }}>Or continue by</Divider>
			<Stack direction="row" spacing={2}>
				<FacebookLogin
					appId={socialConfig.facebook.appId}
					fields="name,email,picture"
					callback={handleFacebookLogin}
					cssClass="facebook"
					textButton={
						<Box
							component="img"
							src={`${appConfig.public_icon_url}/facebook.png`}
							alt="facebook"
							sx={{ width: '58px' }}
						/>
					}
				/>
				<Box
					component="img"
					src={`${appConfig.public_icon_url}/google.png`}
					alt="google"
					className="google"
					onClick={() => handleGoogleLogin()}
				/>
			</Stack>
			<Typography variant="caption">
				By continuing, you accept the &nbsp;
				<Link href="https://www.facebook.com/exe.shiro" target="_blank">
					terms of use
				</Link>
			</Typography>
		</Stack>
	);
};

AuthSocial.propTypes = propTypes;

export default AuthSocial;
