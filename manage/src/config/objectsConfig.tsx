import { Key, ReactNode } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';
import { UserOutlined, DashboardOutlined, SkinOutlined, ControlOutlined } from '@ant-design/icons';

// redux
import { getAccounts } from '../redux/actions/account';
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
  fetching?: PayloadAction<any>;
}

export const filterAccessibleObjects = (
  objects: Readonly<ObjectProps[]>,
  accessible: PermissionProps['object'][]
) => {
  return objects.reduce((result, object) => {
    const { avoid, ...rest } = object;
    if (!accessible.includes(rest.id) && !avoid) return result;
    else if (rest.children) {
      result.push({
        ...rest,
        children: filterAccessibleObjects(
          rest.children,
          accessible.filter((e) => e !== rest.id)
        ),
      });
      return result;
    }
    result.push(rest);
    return result;
  }, [] as ObjectProps[]);
};

const handleNestedObjectPath = (object: ObjectProps, path: string) => {
  const { id, children, actions } = object;
  const result: { [key: string]: any } = {};
  if (children) {
    children.forEach((o) => {
      const camelCaseKey = o.id
        .split('-')
        .reduce((a, b) => a + b.charAt(0).toUpperCase() + b.slice(1));
      result[camelCaseKey] = handleNestedObjectPath(o, path + id + '/');
    });
  } else {
    result.object = path + id;
    result.actions = actions;
  }
  return result;
};

const objectPath = (objects: Readonly<ObjectProps[]>) => {
  const result: { [key: string]: any } = {};
  objects.forEach((object: ObjectProps) => {
    const { id, avoid } = object;
    if (avoid) return;
    const camelCaseKey = id.split('-').reduce((a, b) => a + b.charAt(0).toUpperCase() + b.slice(1));
    result[camelCaseKey] = handleNestedObjectPath(object, '');
  });
  return result;
};

export const OBJECTS: Readonly<ObjectProps[]> = [
  {
    id: 'dashboard',
    key: PATH_DASHBOARD.root,
    label: 'Dashboard',
    avoid: true,
    icon: <DashboardOutlined />,
  },
  {
    id: 'accounts',
    key: getSubKeyByDeepLevel(1, PATH_DASHBOARD.account.root),
    label: 'Accounts',
    icon: <UserOutlined />,
    children: [
      {
        id: 'administrators',
        key: PATH_DASHBOARD.account.administrators,
        label: 'Administrators',
        actions: ['create', 'read', 'update', 'delete', 'authorize'],
        fetching: getAccounts({ type: 'administrator' }),
      },
      {
        id: 'customers',
        key: PATH_DASHBOARD.account.customers,
        label: 'Customers',
        actions: ['create', 'read', 'update', 'delete'],
        fetching: getAccounts({ type: 'customer' }),
      },
    ],
  },
  {
    id: 'products',
    key: getSubKeyByDeepLevel(1, PATH_DASHBOARD.products.root),
    label: 'Products',
    icon: <SkinOutlined />,
    children: [
      {
        id: 'list',
        key: PATH_DASHBOARD.products.list,
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

export const accessibleObjectPath = objectPath(OBJECTS);
