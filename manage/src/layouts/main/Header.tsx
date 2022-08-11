import styled from 'styled-components';
import { Layout, Space, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

// constant
import { HEADER_HEIGHT } from '../../constant';

const { Text } = Typography;

const Header = () => {
  return (
    <RootStyle className="main-header">
      <Space align="center" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div></div>
        <Space size="middle" align="center">
          <Text>Tuệ Dev</Text>
          <LogoutOutlined color="error" />
        </Space>
      </Space>
    </RootStyle>
  );
};

const RootStyle = styled(Layout.Header)({
  height: `${HEADER_HEIGHT}px`,
  position: 'sticky',
  top: 0,
  zIndex: 999,
});

export default Header;
