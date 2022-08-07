import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, Typography, Form, Input, Button, Checkbox, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

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
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: LoginParams) => {
    try {
      const name = await login(values);
      console.log(name);
      navigate(PATH_DASHBOARD.root);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <RootStyled>
      <Box direction="vertical" size="large" style={{ width: '400px', padding: '20px 50px' }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          Tipe Management
        </Title>
        <Form form={form} onFinish={onFinish}>
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
