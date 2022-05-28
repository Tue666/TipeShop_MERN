import { string, func } from 'prop-types';
import { Stack, Typography, TextField, Alert, Slide } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { FormikProvider, useFormik, Form } from 'formik';
import { useSnackbar } from 'notistack';

// apis
import accountApi from '../../apis/accountApi';
// utils
import { createAccountValidation } from '../../utils/validation';

const propTypes = {
	phoneNumber: string,
	handleBackDefaultState: func,
};

const RegisterForm = ({ phoneNumber, handleBackDefaultState }) => {
	const { enqueueSnackbar } = useSnackbar();
	const formik = useFormik({
		initialValues: {
			name: '',
			password: '',
			passwordConfirm: '',
		},
		validationSchema: createAccountValidation,
		onSubmit: async (values, { setErrors, resetForm }) => {
			try {
				await accountApi.register({
					phone_number: phoneNumber,
					...values,
				});
				enqueueSnackbar('Sign up success', {
					variant: 'success',
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'center',
					},
					TransitionComponent: Slide,
				});
				handleBackDefaultState();
			} catch (error) {
				resetForm();
				setErrors({ afterSubmit: error.response.statusText });
			}
		},
	});
	const { touched, errors, isSubmitting, getFieldProps } = formik;
	return (
		<Stack spacing={2}>
			<ArrowBackIosOutlined sx={{ cursor: 'pointer' }} onClick={handleBackDefaultState} />
			<Typography variant="h6">Create account</Typography>
			<FormikProvider value={formik}>
				<Form>
					<Stack spacing={2}>
						<TextField
							fullWidth
							label="Enter your name"
							variant="standard"
							color="success"
							{...getFieldProps('name')}
							error={Boolean(touched.name && errors.name)}
							helperText={touched.name && errors.name}
						/>
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
