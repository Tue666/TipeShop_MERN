import { ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col, Space, Typography, Input, Radio, Button, RadioChangeEvent, message } from 'antd';
import { useFormik, FormikProvider, Form } from 'formik';

// components
import Box from '../Box';
import { UploadSingleFile, FileUploadType } from '../_external_/dropzone';
// redux
import { useAppDispatch } from '../../redux/hooks';
import { createAccount } from '../../redux/actions/account';
// utils
import { createAccountValidation } from '../../utils/validation';

const { Text } = Typography;

interface FormikValues {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  passwordConfirm: string;
  avatar_url: FileUploadType;
}

const AccountGeneralForm = () => {
  const dispatch = useAppDispatch();
  const { type } = useParams();
  const isEdit = window.location.pathname.indexOf('/edit') >= 0;
  const initialValues: FormikValues = {
    name: '',
    email: '',
    phone_number: '',
    password: '',
    passwordConfirm: '',
    avatar_url: '',
  };
  const formik = useFormik({
    initialValues,
    validationSchema: createAccountValidation,
    onSubmit: (values) => {
      message.loading({ content: 'Loading...', key: values.phone_number });
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'avatar_url' && typeof value !== 'string')
          formData.append('avatar_url', value.file);
        else formData.append(key, value);
      });
      dispatch(createAccount(formData));
    },
  });
  const { values, touched, errors, handleBlur, isSubmitting, setFieldValue } = formik;

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleBlur(e);
    const value = e.target.value;
    setFieldValue(e.target.name, value);
  };
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
                  name="name"
                  size="large"
                  placeholder="Enter your name..."
                  defaultValue={values.name}
                  onBlur={handleChangeInput}
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
                    name="email"
                    size="large"
                    placeholder="Enter your email..."
                    defaultValue={values.email}
                    onBlur={handleChangeInput}
                    status={Boolean(touched.email && errors.email) ? 'error' : ''}
                  />
                </Space>
                <Space direction="vertical" size="small">
                  <Text strong>Phone number:</Text>
                  <Input
                    name="phone_number"
                    size="large"
                    placeholder="Enter your phone number..."
                    defaultValue={values.phone_number}
                    onBlur={handleChangeInput}
                    status={Boolean(touched.phone_number && errors.phone_number) ? 'error' : ''}
                  />
                  {touched.phone_number && (
                    <Text strong type="danger">
                      {errors.phone_number}
                    </Text>
                  )}
                </Space>
              </Stack>
              <Space direction="vertical" size="small">
                <Text strong>Password:</Text>
                <Input.Password
                  name="password"
                  size="large"
                  placeholder="Enter your password..."
                  defaultValue={values.password}
                  onBlur={handleChangeInput}
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
                  name="passwordConfirm"
                  size="large"
                  placeholder="Confirm your password..."
                  defaultValue={values.passwordConfirm}
                  onBlur={handleChangeInput}
                  status={Boolean(touched.passwordConfirm && errors.passwordConfirm) ? 'error' : ''}
                />
                {touched.passwordConfirm && (
                  <Text strong type="danger">
                    {errors.passwordConfirm}
                  </Text>
                )}
              </Space>
              {type === 'customers' && (
                <>
                  <Space direction="vertical" size="small">
                    <Text strong>Gender:</Text>
                    <Radio.Group value="male" onChange={handleChangeGender}>
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
