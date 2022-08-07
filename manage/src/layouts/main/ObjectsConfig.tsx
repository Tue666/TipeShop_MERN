import { Key, ReactNode } from 'react';
import { DashboardOutlined, SkinOutlined, ControlOutlined } from '@ant-design/icons';

// contexts
import { PermissionProps } from '../../contexts/AuthContext';
// routes
import { PATH_DASHBOARD } from '../../routes/path';

const getSubKeyByDeepLevel = (level: number, path: string): string => {
  return path.split('/')[level];
};

export interface ObjectProps {
  id: PermissionProps['object'];
  key: Key;
  label: ReactNode;
  icon?: ReactNode;
  children?: ObjectProps[];
}

export const accessibleObjects = (
  objects: ObjectProps[],
  accessible: PermissionProps['object'][]
) => {
  return objects.reduce<ObjectProps[]>(
    (result: ObjectProps[], object: ObjectProps): ObjectProps[] => {
      if (accessible.includes(object.id)) {
        result.push(object);
        return result;
      } else if (object.children) {
        result.push({
          ...object,
          children: accessibleObjects(object.children, accessible),
        });
        return result;
      }
      return result;
    },
    []
  );
};

export const OBJECTS: ObjectProps[] = [
  {
    id: 'dashboard',
    key: PATH_DASHBOARD.root,
    label: 'Dashboard',
    icon: <DashboardOutlined />,
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
      },
    ],
  },
];
