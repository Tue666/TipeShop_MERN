import styled from 'styled-components';
import { MenuProps, Modal } from 'antd';
import { Layout, Space, Typography, Menu, Dropdown } from 'antd';
import { CaretDownOutlined, LogoutOutlined } from '@ant-design/icons';

// hooks
import useAuth from '../../hooks/useAuth';
// constant
import { HEADER_HEIGHT } from '../../constant';

const { Text } = Typography;

type Keys = 'logout';

type MenuKeys = {
  [key in Keys]: string;
};

const menuKeys: MenuKeys = {
  logout: 'logout',
};

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: menuKeys.logout,
    label: 'Log out',
    icon: <LogoutOutlined />,
  },
];

const Header = () => {
  const { profile, logout } = useAuth();
  const { name } = profile!;
  const handleClickMenu: MenuProps['onClick'] = ({ key }) => {
    switch (key as Keys) {
      case 'logout':
        Modal.confirm({
          centered: true,
          title: 'Do you want to log out?',
          content: 'After logging out, you have to log in again next time',
          okButtonProps: {
            danger: true,
          },
          okText: 'Log out',
          onOk() {
            logout();
          },
        });
        break;
      default:
        break;
    }
  };
  return (
    <RootStyle className="main-header">
      <Space align="center" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div></div>
        <Space size="middle" align="center">
          <Text>{name}</Text>
          <Dropdown overlay={<Menu onClick={handleClickMenu} items={items} />} trigger={['click']}>
            <CaretDownOutlined />
          </Dropdown>
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
