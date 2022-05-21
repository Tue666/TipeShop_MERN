import * as yup from 'yup';

export const createAccountValidation = yup.object().shape({
	name: yup.string().required('Name is required!'),
	password: yup.string().required('Password is required!'),
	passwordConfirm: yup.string().required('Confirm is required!'),
});
