import { ReactNode } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';
import { UserOutlined, DashboardOutlined, SkinOutlined, ControlOutlined } from '@ant-design/icons';

// models
import type { Resources, Resource, Permission } from '../models';
// redux
import { fetchAccounts } from '../redux/actions/account';
// routes
import { PATH_DASHBOARD } from '../routes/path';
// utils
import { capitalize } from '../utils/formatString';

const getSubKeyByDeepLevel = (level: number, path: string): string => {
  return path.split('/')[level];
};

export type ResourceConfig = {
  id: Resource['_id'];
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: ResourceConfig[];
  fetching?: PayloadAction<any>;
  avoid?: boolean;
} | null;

export const generateResources = (resources: Resources): ResourceConfig[] => {
  return [
    {
      id: 'dashboard',
      key: PATH_DASHBOARD.root,
      label: 'Dashboard',
      icon: <DashboardOutlined />,
      avoid: true,
    },
    (resources.accounts && {
      id: resources.accounts._id,
      key: getSubKeyByDeepLevel(1, PATH_DASHBOARD.account.root),
      label: resources.accounts.name,
      icon: <UserOutlined />,
      children: [
        (resources.accounts.children.find((e) => e._id === 'administrators') && {
          id: resources.accounts.children.find((e) => e._id === 'administrators')!._id,
          key: PATH_DASHBOARD.account.administrators,
          label: resources.accounts.children.find((e) => e._id === 'administrators')!.name,
          fetching: fetchAccounts({ type: 'Administrator' }),
        }) ||
          null,
        (resources.accounts.children.find((e) => e._id === 'customers') && {
          id: resources.accounts.children.find((e) => e._id === 'customers')!._id,
          key: PATH_DASHBOARD.account.customers,
          label: resources.accounts.children.find((e) => e._id === 'customers')!.name,
          fetching: fetchAccounts({ type: 'Customer' }),
        }) ||
          null,
      ],
    }) ||
      null,
    (resources.products && {
      id: resources.products._id,
      key: getSubKeyByDeepLevel(1, PATH_DASHBOARD.products.root),
      label: resources.products.name,
      icon: <SkinOutlined />,
      children: [
        (resources.products.children.find((e) => e._id === 'list') && {
          id: resources.products.children.find((e) => e._id === 'list')!._id,
          key: PATH_DASHBOARD.products.list,
          label: resources.products.children.find((e) => e._id === 'list')!.name,
        }) ||
          null,
      ],
    }) ||
      null,
    (resources['access control'] && {
      id: resources['access control']._id,
      key: getSubKeyByDeepLevel(1, PATH_DASHBOARD.accessControl.root),
      label: resources['access control'].name,
      icon: <ControlOutlined />,
      children: [
        (resources['access control'].children.find((e) => e._id === 'roles') && {
          id: resources['access control'].children.find((e) => e._id === 'roles')!._id,
          key: PATH_DASHBOARD.accessControl.roles,
          label: resources['access control'].children.find((e) => e._id === 'roles')!.name,
        }) ||
          null,
        (resources['access control'].children.find((e) => e._id === 'resources') && {
          id: resources['access control'].children.find((e) => e._id === 'resources')!._id,
          key: PATH_DASHBOARD.accessControl.resources,
          label: resources['access control'].children.find((e) => e._id === 'resources')!.name,
        }) ||
          null,
        (resources['access control'].children.find((e) => e._id === 'operations') && {
          id: resources['access control'].children.find((e) => e._id === 'operations')!._id,
          key: PATH_DASHBOARD.accessControl.operations,
          label: resources['access control'].children.find((e) => e._id === 'operations')!.name,
        }) ||
          null,
      ],
    }) ||
      null,
  ];
};

export const filterAccessibleResources = (
  resources: ResourceConfig[],
  resourcesAllowed: Permission['resource'][]
) => {
  return resources.reduce((result, resource) => {
    if (!resource) return result;
    const { avoid, ...rest } = resource;
    if (!resourcesAllowed.includes(rest.id) && !avoid) return result;
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
