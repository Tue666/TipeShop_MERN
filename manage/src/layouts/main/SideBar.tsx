import { useNavigate, Link } from 'react-router-dom';
import { Space, MenuProps, Layout, Menu, Image } from 'antd';

// hooks
import useAuth from '../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../routes/path';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const SideBar = () => {
  const navigate = useNavigate();
  const { accessibleObjects } = useAuth();
  const menuItems = accessibleObjects.map((item) => {
    const { key, label, icon, children } = item;
    const menuItem: MenuItem = { key, label, icon, children };
    return menuItem;
  });
  const isActive = window.location.pathname;
  const deep = (isActive.match(/\//g) || []).length;
  const openKeys = isActive
    .substring(1)
    .split('/')
    .slice(0, deep - 1);

  const handleClickItem: MenuProps['onClick'] = (item) => {
    const { key } = item;
    navigate(key);
  };
  return (
    <Sider collapsible breakpoint="sm">
      <Space align="center" style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <Link to={PATH_DASHBOARD.root}>
          <Image preview={false} width={50} src="/logo.png" />
        </Link>
      </Space>
      <Menu
        theme="dark"
        mode="inline"
        defaultOpenKeys={openKeys}
        selectedKeys={[isActive]}
        items={menuItems}
        onClick={handleClickItem}
      />
    </Sider>
  );
};

export default SideBar;
