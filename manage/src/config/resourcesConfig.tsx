import { ReactNode } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  UserOutlined,
  DashboardOutlined,
  CustomerServiceOutlined,
  SkinOutlined,
  ControlOutlined,
  RestOutlined,
} from '@ant-design/icons';

// models
import type { Resources, Resource, Permission } from '../models';
// redux
import { getAccountsAction } from '../redux/actions/account';
// routes
import { PATH_DASHBOARD } from '../routes/path';
// utils
import { capitalize } from '../utils/formatString';

const getSubKeyByDeepLevel = (level: number, path: string): string => {
  return path.split('/')[level];
};

export type ResourceConfig = {
  id: Resource['_id'];
  locked?: Resource['locked'];
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: ResourceConfig[];
  fetching?: PayloadAction<any>;
  avoid?: boolean;
} | null;

export const rootResources = (resources: Resource[]): Resources => {
  return resources.reduce((acc, resource) => {
    const { _id } = resource;
    return { ...acc, [_id]: resource };
  }, {} as Resources);
};

export const generateResources = (resources: Resource[]): ResourceConfig[] => {
  const root = rootResources(resources);
  return [
    {
      id: 'dashboard',
      key: PATH_DASHBOARD.root,
      label: 'Dashboard',
      icon: <DashboardOutlined />,
      avoid: true,
    },
    (root['customer service'] && {
      id: root['customer service']._id,
      locked: root['customer service'].locked,
      key: PATH_DASHBOARD.customerService,
      label: root['customer service'].name,
      icon: <CustomerServiceOutlined />,
    }) ||
      null,
    (root.accounts && {
      id: root.accounts._id,
      locked: root.accounts.locked,
      key: getSubKeyByDeepLevel(1, PATH_DASHBOARD.account.root),
      label: root.accounts.name,
      icon: <UserOutlined />,
      children: [
        (root.accounts.children?.find((e) => e._id === 'administrators') && {
          id: root.accounts.children?.find((e) => e._id === 'administrators')!._id,
          locked: root.accounts.children?.find((e) => e._id === 'administrators')!.locked,
          key: PATH_DASHBOARD.account.administrators,
          label: root.accounts.children?.find((e) => e._id === 'administrators')!.name,
          fetching: getAccountsAction({ type: 'Administrator' }),
        }) ||
          null,
        (root.accounts.children?.find((e) => e._id === 'customers') && {
          id: root.accounts.children?.find((e) => e._id === 'customers')!._id,
          locked: root.accounts.children?.find((e) => e._id === 'customers')!.locked,
          key: PATH_DASHBOARD.account.customers,
          label: root.accounts.children?.find((e) => e._id === 'customers')!.name,
          fetching: getAccountsAction({ type: 'Customer' }),
        }) ||
          null,
      ],
    }) ||
      null,
    (root.products && {
      id: root.products._id,
      locked: root.products.locked,
      key: getSubKeyByDeepLevel(1, PATH_DASHBOARD.products.root),
      label: root.products.name,
      icon: <SkinOutlined />,
      children: [
        (root.products.children?.find((e) => e._id === 'product list') && {
          id: root.products.children?.find((e) => e._id === 'product list')!._id,
          locked: root.products.children?.find((e) => e._id === 'product list')!.locked,
          key: PATH_DASHBOARD.products.productList,
          label: root.products.children?.find((e) => e._id === 'product list')!.name,
        }) ||
          null,
        (root.products.children?.find((e) => e._id === 'categories') && {
          id: root.products.children?.find((e) => e._id === 'categories')!._id,
          locked: root.products.children?.find((e) => e._id === 'categories')!.locked,
          key: PATH_DASHBOARD.products.categories,
          label: root.products.children?.find((e) => e._id === 'categories')!.name,
        }) ||
          null,
      ],
    }) ||
      null,
    (root['access control'] && {
      id: root['access control']._id,
      locked: root['access control'].locked,
      key: getSubKeyByDeepLevel(1, PATH_DASHBOARD.accessControl.root),
      label: root['access control'].name,
      icon: <ControlOutlined />,
      children: [
        (root['access control'].children?.find((e) => e._id === 'roles') && {
          id: root['access control'].children?.find((e) => e._id === 'roles')!._id,
          locked: root['access control'].children?.find((e) => e._id === 'roles')!.locked,
          key: PATH_DASHBOARD.accessControl.roles,
          label: root['access control'].children?.find((e) => e._id === 'roles')!.name,
        }) ||
          null,
        (root['access control'].children?.find((e) => e._id === 'resources') && {
          id: root['access control'].children?.find((e) => e._id === 'resources')!._id,
          locked: root['access control'].children?.find((e) => e._id === 'resources')!.locked,
          key: PATH_DASHBOARD.accessControl.resources,
          label: root['access control'].children?.find((e) => e._id === 'resources')!.name,
        }) ||
          null,
        (root['access control'].children?.find((e) => e._id === 'operations') && {
          id: root['access control'].children?.find((e) => e._id === 'operations')!._id,
          locked: root['access control'].children?.find((e) => e._id === 'operations')!.locked,
          key: PATH_DASHBOARD.accessControl.operations,
          label: root['access control'].children?.find((e) => e._id === 'operations')!.name,
        }) ||
          null,
      ],
    }) ||
      null,
    (root['recycle bin'] && {
      id: root['recycle bin']._id,
      locked: root['recycle bin'].locked,
      key: getSubKeyByDeepLevel(1, PATH_DASHBOARD.recycleBin.root),
      label: root['recycle bin'].name,
      icon: <RestOutlined />,
      children: [
        (root['recycle bin'].children?.find((e) => e._id === 'operations deleted') && {
          id: root['recycle bin'].children?.find((e) => e._id === 'operations deleted')!._id,
          locked: root['recycle bin'].children?.find((e) => e._id === 'operations deleted')!.locked,
          key: PATH_DASHBOARD.recycleBin.operations,
          label: root['recycle bin'].children?.find((e) => e._id === 'operations deleted')!.name,
        }) ||
          null,
      ],
    }) ||
      null,
  ];
};

export const filterAccessibleResources = (
  resources: ResourceConfig[],
  resourcesAllowed: Permission['resource']
) => {
  return resources.reduce((result, resource) => {
    if (!resource) return result;
    const { avoid, locked, ...rest } = resource;
    if ((!resourcesAllowed.includes(rest.id) && !avoid) || locked) return result;
    else if (rest.children) {
      result.push({
        ...rest,
        label: capitalize(rest.label as string),
        children: filterAccessibleResources(
          rest.children,
          resourcesAllowed.filter((allowed) => allowed !== rest.id)
        ),
      });
      return result;
    }
    result.push({
      ...rest,
      label: capitalize(rest.label as string),
    });
    return result;
  }, [] as ResourceConfig[]);
};
