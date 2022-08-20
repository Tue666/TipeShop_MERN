import styled from 'styled-components';
import { Row, Col, Space, Typography, Input, Radio, Button, RadioChangeEvent, message } from 'antd';
import { useFormik, FormikProvider, Form } from 'formik';

// components
import Box from '../Box';
import { UploadSingleFile } from '../_external_/dropzone';
// models
import type { Account, Administrator, Customer } from '../../models';
// redux
import { useAppDispatch } from '../../redux/hooks';
import type { CreateAccountPayload } from '../../redux/actions/account';
import { createAccount } from '../../redux/actions/account';
// utils
import { createAccountValidation } from '../../utils/validation';

const { Text } = Typography;

const AccountGeneralForm = ({ account_type }: Record<'account_type', Account['type']>) => {
  const dispatch = useAppDispatch();
  const isEdit = window.location.pathname.indexOf('/edit') >= 0;
  const customer: Customer = {
    gender: '',
  };
  const administrator: Administrator = {};
  let dependentValues = account_type === 'Administrator' ? administrator : customer;
  const initialValues: CreateAccountPayload = {
    name: '',
    email: '',
    phone_number: '',
    password: '',
    passwordConfirm: '',
    avatar_url: '',
    account_type,
    ...dependentValues,
  };
  const formik = useFormik({
    initialValues,
    validationSchema: createAccountValidation,
    onSubmit: async (values) => {
      message.loading({ content: 'Processing...', key: 'create' });
      dispatch(
        createAccount({
          ...values,
          account_type,
        })
      );
    },
  });
  const { values, touched, errors, isSubmitting, getFieldProps, setFieldValue } = formik;

  const handleChangeGender = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setFieldValue('gender', value);
  };
  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFieldValue('avatar_url', {
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };
  return (
    <FormikProvider value={formik}>
      <Form>
        <Row gutter={25} align="middle" style={{ padding: '0 10px' }}>
          <Col flex="auto">
            <Box direction="vertical" size="middle" style={{ padding: '20px' }}>
              <Space direction="vertical" size="small">
                <Text strong>Name:</Text>
                <Input
                  size="large"
                  placeholder="Enter your name..."
                  {...getFieldProps('name')}
                  status={Boolean(touched.name && errors.name) ? 'error' : ''}
                />
                {touched.name && (
                  <Text strong type="danger">
                    {errors.name}
                  </Text>
                )}
              </Space>
              <Stack size="middle" align="baseline">
                <Space direction="vertical" size="small">
                  <Text strong>Email:</Text>
                  <Input
                    size="large"
                    placeholder="Enter your email..."
                    {...getFieldProps('email')}
                    status={Boolean(touched.email && errors.email) ? 'error' : ''}
                  />
                </Space>
                <Space direction="vertical" size="small">
                  <Text strong>Phone number:</Text>
                  <Input
                    size="large"
                    placeholder="Enter your phone number..."
                    {...getFieldProps('phone_number')}
                    status={Boolean(touched.phone_number && errors.phone_number) ? 'error' : ''}
                  />
                  {touched.phone_number && (
                    <Text strong type="danger">
                      {errors.phone_number}
                    </Text>
                  )}
                </Space>
              </Stack>
              {!isEdit && (
                <>
                  <Space direction="vertical" size="small">
                    <Text strong>Password:</Text>
                    <Input.Password
                      size="large"
                      placeholder="Enter your password..."
                      {...getFieldProps('password')}
                      status={Boolean(touched.password && errors.password) ? 'error' : ''}
                    />
                    {touched.password && (
                      <Text strong type="danger">
                        {errors.password}
                      </Text>
                    )}
                  </Space>
                  <Space direction="vertical" size="small">
                    <Text strong>Password confirm:</Text>
                    <Input.Password
                      size="large"
                      placeholder="Confirm your password..."
                      {...getFieldProps('passwordConfirm')}
                      status={
                        Boolean(touched.passwordConfirm && errors.passwordConfirm) ? 'error' : ''
                      }
                    />
                    {touched.passwordConfirm && (
                      <Text strong type="danger">
                        {errors.passwordConfirm}
                      </Text>
                    )}
                  </Space>
                </>
              )}
              {account_type === 'Customer' && (
                <>
                  <Space direction="vertical" size="small">
                    <Text strong>Gender:</Text>
                    <Radio.Group value={values.gender} onChange={handleChangeGender}>
                      <Radio value="male">Male</Radio>
                      <Radio value="female">Female</Radio>
                      <Radio value="other">Other</Radio>
                    </Radio.Group>
                  </Space>
                </>
              )}
              <Button htmlType="submit" type="primary" block loading={isSubmitting}>
                {isEdit ? 'Save changes' : 'Create'}
              </Button>
            </Box>
          </Col>
          <Col flex="365px">
            <Box direction="vertical" size="small" style={{ padding: '15px', height: '100%' }}>
              <Text strong>Image:</Text>
              <UploadSingleFile
                accept={{
                  'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
                }}
                maxSize={1048576}
                file={values.avatar_url}
                onDrop={handleDrop}
                caption={
                  <Text
                    type="secondary"
                    className="caption"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of 1 MB
                  </Text>
                }
                showRejected
              />
            </Box>
          </Col>
        </Row>
      </Form>
    </FormikProvider>
  );
};

const Stack = styled(Space)({
  '& > .ant-space-item': {
    width: '100%',
  },
});

export default AccountGeneralForm;
