import * as yup from 'yup';

// ----------------------Account----------------------
export const createAccountValidation = yup.object().shape({
  phone_number: yup
    .string()
    .required('Phone number is required!')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Invalid phone number!'),
  name: yup.string().required('Name is required!'),
  password: yup.string().required('Password is required!'),
  passwordConfirm: yup.string().required('Confirm is required!'),
});

export const updateAccountValidation = yup.object().shape({
  phone_number: yup
    .string()
    .required('Phone number is required!')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Invalid phone number!'),
  name: yup.string().required('Name is required!'),
});
