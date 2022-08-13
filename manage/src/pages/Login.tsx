import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, Typography, Form, Input, Button, Checkbox, Space, Alert, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

// components
import Box from '../components/Box';
// contexts
import { LoginParams } from '../contexts/AuthContext';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../routes/path';

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const { resetFields } = form;
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();

  const onFinish = async (values: LoginParams) => {
    try {
      const name = await login(values);
      message.success(`Welcome back, ${name}`);
      navigate(PATH_DASHBOARD.root);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        resetFields();
        setError(error.response?.statusText);
      }
    }
  };
  const onFocus = () => {
    error && setError(undefined);
  };
  return (
    <RootStyled>
      <Box direction="vertical" style={{ width: '400px', padding: '20px 50px' }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          Tipe Management
        </Title>
        <Form form={form} onFinish={onFinish} onFocus={onFocus}>
          <Form.Item
            name="phone_number"
            rules={[
              {
                required: true,
                message: 'Please input right your phone number!',
                pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Phone number" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Checkbox>Remember me</Checkbox>
              <a className="login-form-forgot" href="/">
                Forgot password
              </a>
            </Space>
          </Form.Item>
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: '10px' }}
            />
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </RootStyled>
  );
};

const RootStyled = styled(Layout)({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export default Login;
