import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
	Stack,
	Typography,
	TextField,
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
	Checkbox,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { FormikProvider, useFormik, Form, getIn } from 'formik';
import { useSelector, useDispatch } from 'react-redux';

// components
import Page from '../../components/Page';
import { Location } from '../../components/customer';
// redux
import { insertAddress, editAddress } from '../../redux/slices/account';
// routes
import { PATH_CUSTOMER } from '../../routes/path';
// utils
import { createAddressValidation } from '../../utils/validation';

const AddressForm = () => {
	const navigate = useNavigate();
	const { pathname, state } = useLocation();
	const isEdit = pathname.includes('edit');
	const { addresses } = useSelector((state) => state.account);
	const address_id = pathname.split('/').pop();
	const address = addresses.find((address) => address._id === address_id);
	const dispatch = useDispatch();
	const formik = useFormik({
		initialValues: {
			name: address?.name || '',
			company: address?.company || '',
			phoneNumber: address?.phone_number || '',
			location: address
				? {
						region: address.region._id,
						district: address.district._id,
						ward: address.ward._id,
				  }
				: {
						region: '',
						district: '',
						ward: '',
				  },
			street: address?.street || '',
			addressType: address?.delivery_address_type || 'home',
			isDefault: address?.is_default || false,
		},
		validationSchema: createAddressValidation,
		onSubmit: (values) => {
			const { phoneNumber, location, addressType, isDefault, ...other } = values;
			const body = {
				phone_number: phoneNumber,
				region_id: location.region,
				district_id: location.district,
				ward_id: location.ward,
				delivery_address_type: addressType,
				is_default: isDefault,
				...other,
			};
			if (!isEdit) dispatch(insertAddress(body));
			else
				dispatch(
					editAddress({
						_id: address_id,
						...body,
					})
				);
			navigate(state?.isIntendedCheckout ? -1 : PATH_CUSTOMER.addresses);
		},
	});
	const { values, touched, errors, isSubmitting, handleBlur, setFieldValue } = formik;

	const handleChangeInput = (e) => {
		handleBlur(e);
		const value = e.target.value;
		setFieldValue(e.target.name, value);
	};
	const handleSelectedLocation = (value) => {
		setFieldValue('location', value);
	};
	const handleChangeAddressType = (e) => {
		const value = e.target.value;
		setFieldValue('addressType', value);
	};
	const handleSelectIsDefault = (e) => {
		const isChecked = e.target.checked;
		setFieldValue('isDefault', isChecked);
	};
	return (
		<Page title="Add new address | Tipe">
			<FormikProvider value={formik}>
				<Form>
					<RootStyle spacing={1} p={3}>
						<ArrowBackIosOutlined
							sx={{ cursor: 'pointer' }}
							onClick={() => navigate(state?.isIntendedCheckout ? -1 : PATH_CUSTOMER.addresses)}
						/>
						<Stack direction="row" alignItems="center" spacing={3}>
							<Typography variant="subtitle2" sx={{ width: '300px' }}>
								First - Last name
							</Typography>
							<TextField
								fullWidth
								name="name"
								label="Enter your full name"
								variant="outlined"
								size="small"
								defaultValue={values.name}
								onBlur={handleChangeInput}
								error={Boolean(touched.name && errors.name)}
								helperText={touched.name && errors.name}
							/>
						</Stack>
						<Stack direction="row" alignItems="center" spacing={3}>
							<Typography variant="subtitle2" sx={{ width: '300px' }}>
								Company
							</Typography>
							<TextField
								fullWidth
								name="company"
								label="Enter your company name"
								variant="outlined"
								size="small"
								defaultValue={values.company}
								onBlur={handleChangeInput}
								error={Boolean(touched.company && errors.company)}
								helperText={touched.company && errors.company}
							/>
						</Stack>
						<Stack direction="row" alignItems="center" spacing={3}>
							<Typography variant="subtitle2" sx={{ width: '300px' }}>
								Phone number
							</Typography>
							<TextField
								fullWidth
								name="phoneNumber"
								label="Enter your phone number"
								variant="outlined"
								size="small"
								defaultValue={values.phoneNumber}
								onBlur={handleChangeInput}
								error={Boolean(touched.phoneNumber && errors.phoneNumber)}
								helperText={touched.phoneNumber && errors.phoneNumber}
							/>
						</Stack>
						<Location
							isEdit={isEdit}
							location={values.location}
							errors={{
								region: getIn(touched, 'location.region') && getIn(errors, 'location.region'),
								district: getIn(touched, 'location.district') && getIn(errors, 'location.district'),
								ward: getIn(touched, 'location.ward') && getIn(errors, 'location.ward'),
							}}
							handleSelectedLocation={handleSelectedLocation}
						/>
						<Stack direction="row" alignItems="center" spacing={3}>
							<Typography variant="subtitle2" sx={{ width: '300px' }}>
								Street
							</Typography>
							<TextField
								fullWidth
								multiline
								rows={4}
								name="street"
								label="Enter your street"
								defaultValue={values.street}
								onBlur={handleChangeInput}
								error={Boolean(touched.street && errors.street)}
								helperText={touched.street && errors.street}
							/>
						</Stack>
						<Stack direction="row" alignItems="center" spacing={3}>
							<Typography variant="subtitle2" sx={{ width: '215px' }}>
								Address type
							</Typography>
							<FormControl>
								<RadioGroup row value={values.addressType} onChange={handleChangeAddressType}>
									<FormControlLabel value="home" control={<Radio size="small" />} label="Private house / Apartment" />
									<FormControlLabel value="company" control={<Radio size="small" />} label="Agency / Company" />
								</RadioGroup>
							</FormControl>
						</Stack>
						{(!isEdit || (isEdit && !address.is_default)) && (
							<Stack direction="row" alignItems="center" spacing={3}>
								<Typography variant="subtitle2" sx={{ width: '204px' }}>
									Default address
								</Typography>
								<Checkbox checked={values.isDefault} size="small" onClick={handleSelectIsDefault} />
							</Stack>
						)}
						<LoadingButton
							type="submit"
							loading={isSubmitting}
							variant="contained"
							color="success"
							disableElevation
						>
							SAVE CHANGE
						</LoadingButton>
					</RootStyle>
				</Form>
			</FormikProvider>
		</Page>
	);
};

const RootStyle = styled(Stack)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	borderRadius: '8px',
}));

export default AddressForm;
