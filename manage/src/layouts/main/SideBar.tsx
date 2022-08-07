import { Key, ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Space, MenuProps, Layout, Menu, Image } from 'antd';
import { DashboardOutlined, SkinOutlined, ControlOutlined } from '@ant-design/icons';

// hooks
import useAuth from '../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../routes/path';
//
import { OBJECTS, accessibleObjects } from './ObjectsConfig';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const getSubKeyByDeepLevel = (level: number, path: string): string => {
  return path.split('/')[level];
};

const getItem = (
  key: Key, // also path
  label: ReactNode,
  icon?: ReactNode,
  children?: MenuItem[]
): MenuItem => {
  return {
    key,
    label,
    icon,
    children,
  };
};

const items: MenuItem[] = [
  getItem(PATH_DASHBOARD.root, 'Dashboard', <DashboardOutlined />),
  getItem(getSubKeyByDeepLevel(1, PATH_DASHBOARD.product.root), 'Product', <SkinOutlined />, [
    getItem(PATH_DASHBOARD.product.list, 'List Product'),
  ]),
  getItem(
    getSubKeyByDeepLevel(1, PATH_DASHBOARD.accessControl.root),
    'Access Control',
    <ControlOutlined />,
    [getItem(PATH_DASHBOARD.accessControl.operations, 'Operations')]
  ),
];

const SideBar = () => {
  console.log(accessibleObjects(OBJECTS, ['access-control']));
  const navigate = useNavigate();
  const { permissions } = useAuth();
  console.log(permissions);
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
        items={items}
        onClick={handleClickItem}
      />
    </Sider>
  );
};

export default SideBar;
