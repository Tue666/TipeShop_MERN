import { shape, arrayOf, string, func } from 'prop-types';
import { Stack, Typography, TextField, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { FormikProvider, useFormik, Form } from 'formik';

// components
import Avatar from '../../components/Avatar';
// utils
import enqueueSnackbar from '../../utils/snackbar';
import { createAccountValidation } from '../../utils/validation';

const propTypes = {
	phoneNumber: string,
	socialAccount: shape({
		name: string,
		email: string,
		avatar_url: string,
		social: arrayOf(
			shape({
				id: string,
				type: string,
			})
		),
	}),
	handleBackDefaultState: func,
	register: func,
	closeModal: func,
};

const RegisterForm = ({
	phoneNumber,
	socialAccount,
	handleBackDefaultState,
	register,
	closeModal,
}) => {
	const formik = useFormik({
		initialValues: {
			name: socialAccount?.name || '',
			password: '',
			passwordConfirm: '',
		},
		validationSchema: createAccountValidation,
		onSubmit: async (values, { setErrors, resetForm }) => {
			try {
				const others = socialAccount
					? {
							...values,
							...socialAccount,
					  }
					: values;
				const name = await register({
					phone_number: phoneNumber,
					...others,
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
				resetForm();
				setErrors({ afterSubmit: error.response.statusText });
			}
		},
	});
	const { touched, errors, isSubmitting, getFieldProps } = formik;
	return (
		<Stack spacing={2}>
			<ArrowBackIosOutlined sx={{ cursor: 'pointer' }} onClick={() => handleBackDefaultState()} />
			{socialAccount && (
				<Stack alignItems="center" spacing={1}>
					<Avatar
						name={socialAccount.name}
						src={socialAccount.avatar_url}
						sx={{ width: '100px', height: '100px' }}
					/>
					<Typography variant="body1" sx={{ fontWeight: 'bold' }}>
						{socialAccount.name}
					</Typography>
				</Stack>
			)}
			{!socialAccount && <Typography variant="h6">Create account</Typography>}
			<FormikProvider value={formik}>
				<Form>
					<Stack spacing={2}>
						{!socialAccount && (
							<TextField
								fullWidth
								label="Enter your name"
								variant="standard"
								color="success"
								{...getFieldProps('name')}
								error={Boolean(touched.name && errors.name)}
								helperText={touched.name && errors.name}
							/>
						)}
						<TextField
							fullWidth
							label="Enter password"
							variant="standard"
							color="success"
							type="password"
							{...getFieldProps('password')}
							error={Boolean(touched.password && errors.password)}
							helperText={touched.password && errors.password}
						/>
						<TextField
							fullWidth
							label="Confirm your password"
							variant="standard"
							color="success"
							type="password"
							{...getFieldProps('passwordConfirm')}
							error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
							helperText={touched.passwordConfirm && errors.passwordConfirm}
						/>
						{errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
						<LoadingButton
							type="submit"
							loading={isSubmitting}
							variant="contained"
							disableElevation
							color="error"
						>
							Sign up
						</LoadingButton>
					</Stack>
				</Form>
			</FormikProvider>
		</Stack>
	);
};

RegisterForm.propTypes = propTypes;

export default RegisterForm;
