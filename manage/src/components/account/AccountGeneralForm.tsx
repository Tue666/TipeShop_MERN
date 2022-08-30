import { useEffect } from 'react';
import styled from 'styled-components';
import {
  Row,
  Col,
  Space,
  Typography,
  Input,
  Radio,
  Button,
  RadioChangeEvent,
  message,
  Select,
} from 'antd';
import { useFormik, FormikProvider, Form } from 'formik';

// components
import Box from '../Box';
import { UploadSingleFile } from '../_external_/dropzone';
// guard
import type { ActionsPassedGuardProps } from '../../guards/AccessGuard';
// models
import type { Account, Administrator, Customer, GeneralAccount, Role } from '../../models';
// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import type { CreateAccountPayload, UpdateAccountPayload } from '../../redux/actions/account';
import { createAccountAction, updateAccountAction } from '../../redux/actions/account';
import { clearAction, selectAccount } from '../../redux/slices/account';
import { selectAccessControl } from '../../redux/slices/accessControl';
// utils
import { createAccountValidation, updateAccountValidation } from '../../utils/validation';
import { humanFileSize } from '../../utils/formatNumber';

const { Option } = Select;
const { Text } = Typography;

export interface AccountGeneralFormProps extends Pick<ActionsPassedGuardProps, 'actionsAllowed'> {
  account?: GeneralAccount;
  account_type: Account['type'];
}

const AccountGeneralForm = ({ account, account_type, actionsAllowed }: AccountGeneralFormProps) => {
  const { lastAction } = useAppSelector(selectAccount);
  const { roles } = useAppSelector(selectAccessControl);
  const dispatch = useAppDispatch();
  const customer: Customer = {
    gender: account?.gender || '',
    social: account?.social || [],
  };
  const administrator: Administrator = {};
  let dependentValues = account_type === 'Administrator' ? administrator : customer;
  const initialValues: CreateAccountPayload | UpdateAccountPayload = {
    name: account?.name || '',
    email: account?.email || '',
    phone_number: account?.phone_number || '',
    password: '',
    passwordConfirm: '',
    avatar_url: account?.avatar_url || null,
    roles: account?.roles || [],
    account_type,
    ...dependentValues,
  };
  const formik = useFormik({
    initialValues,
    validationSchema: account ? updateAccountValidation : createAccountValidation,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (!account) {
        // create goes here
        message.loading({ content: 'Processing...', key: 'create' });
        dispatch(createAccountAction(values));
        return;
      }
      // update goes here
      message.loading({ content: 'Processing...', key: 'update' });
      dispatch(
        updateAccountAction({
          _id: account._id,
          ...values,
        })
      );
    },
  });
  const { values, touched, errors, isSubmitting, getFieldProps, setFieldValue, resetForm } = formik;
  useEffect(() => {
    if (lastAction !== undefined) {
      switch (lastAction) {
        case 'create':
          resetForm();
          break;
        default:
          break;
      }
      dispatch(clearAction());
    }
    // eslint-disable-next-line
  }, [lastAction]);

  const handleChangeRoles = (value: Role['name'][]) => {
    setFieldValue('roles', value);
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
              {!account && (
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
              {actionsAllowed.includes('authorize') && (
                <Space direction="vertical" size="small">
                  <Text strong>Roles:</Text>
                  <Select
                    value={values.roles}
                    mode="multiple"
                    allowClear
                    showSearch
                    placeholder="Specify the role of the account"
                    style={{ width: '100%' }}
                    onChange={handleChangeRoles}
                  >
                    {roles.map((role) => {
                      const { _id, name } = role;
                      return (
                        <Option key={_id} value={name}>
                          {name}
                        </Option>
                      );
                    })}
                  </Select>
                </Space>
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
                {account ? 'Save changes' : 'Create'}
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
                    <br /> max size of {humanFileSize(1048576)}
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
