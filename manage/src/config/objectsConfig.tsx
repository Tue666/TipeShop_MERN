import { Key, ReactNode } from 'react';
import { UserOutlined, DashboardOutlined, SkinOutlined, ControlOutlined } from '@ant-design/icons';

// routes
import { PATH_DASHBOARD } from '../routes/path';

const getSubKeyByDeepLevel = (level: number, path: string): string => {
  return path.split('/')[level];
};

export interface PermissionProps {
  object: string;
  actions: string[];
}

export interface ObjectProps {
  id: PermissionProps['object'];
  key: Key;
  label: ReactNode;
  avoid?: Boolean;
  icon?: ReactNode;
  children?: ObjectProps[];
  actions?: PermissionProps['actions'];
}

export const accessibleObjects = (
  objects: ObjectProps[],
  accessible: PermissionProps['object'][]
) => {
  return objects.reduce((result: ObjectProps[], object: ObjectProps) => {
    const { avoid, ...rest } = object;
    if (!accessible.includes(rest.id) && !avoid) return result;
    else if (rest.children) {
      result.push({
        ...rest,
        children: accessibleObjects(
          rest.children,
          accessible.filter((e) => e !== rest.id)
        ),
      });
      return result;
    }
    result.push(rest);
    return result;
  }, []);
};

const handleNestedObject = (object: ObjectProps, path: string) => {
  const { id, children, actions } = object;
  const result: { [key: string]: any } = {};
  if (children) {
    children.forEach((o) => {
      const camelCaseKey = o.id
        .split('-')
        .reduce((a, b) => a + b.charAt(0).toUpperCase() + b.slice(1));
      result[camelCaseKey] = handleNestedObject(o, path + id + '/');
    });
  } else {
    result.object = path + id;
    result.actions = actions;
  }
  return result;
};

const objectTree = (objects: ObjectProps[]) => {
  const result: { [key: string]: any } = {};
  objects.forEach((object: ObjectProps) => {
    const { id, avoid } = object;
    if (avoid) return;
    const camelCaseKey = id.split('-').reduce((a, b) => a + b.charAt(0).toUpperCase() + b.slice(1));
    result[camelCaseKey] = handleNestedObject(object, '');
  });
  return result;
};

export const OBJECTS: ObjectProps[] = [
  {
    id: 'dashboard',
    key: PATH_DASHBOARD.root,
    label: 'Dashboard',
    avoid: true,
    icon: <DashboardOutlined />,
  },
  {
    id: 'account',
    key: getSubKeyByDeepLevel(1, PATH_DASHBOARD.account.root),
    label: 'Account',
    icon: <UserOutlined />,
    children: [
      {
        id: 'administrator',
        key: PATH_DASHBOARD.account.administrator,
        label: 'Administrator',
        actions: ['create', 'read', 'update', 'delete', 'authorize'],
      },
      {
        id: 'customer',
        key: PATH_DASHBOARD.account.customer,
        label: 'Customer',
        actions: ['create', 'read', 'update', 'delete'],
      },
    ],
  },
  {
    id: 'product',
    key: getSubKeyByDeepLevel(1, PATH_DASHBOARD.product.root),
    label: 'Product',
    icon: <SkinOutlined />,
    children: [
      {
        id: 'list',
        key: PATH_DASHBOARD.product.list,
        label: 'List Product',
        actions: ['create', 'read', 'update', 'delete'],
      },
    ],
  },
  {
    id: 'access-control',
    key: getSubKeyByDeepLevel(1, PATH_DASHBOARD.accessControl.root),
    label: 'Access Control',
    icon: <ControlOutlined />,
    children: [
      {
        id: 'operations',
        key: PATH_DASHBOARD.accessControl.operations,
        label: 'Operations',
        actions: ['lock'],
      },
    ],
  },
];

export const accessibleObjectTree = objectTree(OBJECTS);
