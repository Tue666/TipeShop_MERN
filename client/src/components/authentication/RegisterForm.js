import { string, func } from 'prop-types';
import { Stack, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { FormikProvider, useFormik, Form } from 'formik';

// utils
import { createAccountValidation } from '../../utils/validation';

const propTypes = {
	phoneNumber: string,
	handleBackDefaultState: func,
};

const RegisterForm = ({ phoneNumber, handleBackDefaultState }) => {
	const formik = useFormik({
		initialValues: {
			name: '',
			password: '',
			passwordConfirm: '',
		},
		validationSchema: createAccountValidation,
		onSubmit: (values) => {
			console.log({
				phoneNumber,
				...values,
			});
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
						<LoadingButton type="submit" loading={isSubmitting} variant="contained" color="error">
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
