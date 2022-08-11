const path = (root: string, sublink: string): string => {
  return `${root}${sublink}`;
};

const ROOT_DASHBOARD = '/';
const ROOT_AUTH = '/auth';
const ROOT_EXTERNAL = '/external';

const ROOT_ACCOUNT = path(ROOT_DASHBOARD, 'accounts');
const ROOT_PRODUCT = path(ROOT_DASHBOARD, 'products');
const ROOT_ACCESS_CONTROL = path(ROOT_DASHBOARD, 'access-control');

export const PATH_DASHBOARD = {
  root: ROOT_DASHBOARD,
  account: {
    root: ROOT_ACCOUNT,
    administrators: path(ROOT_ACCOUNT, '/administrators'),
    customers: path(ROOT_ACCOUNT, '/customers'),
    create: (type: string = 'customers') => path(ROOT_ACCOUNT, `/${type}/create`),
  },
  products: {
    root: ROOT_PRODUCT,
    list: path(ROOT_PRODUCT, '/list'),
  },
  accessControl: {
    root: ROOT_ACCESS_CONTROL,
    operations: path(ROOT_ACCESS_CONTROL, '/operations'),
  },
};

export const PATH_AUTH = {
  login: path(ROOT_AUTH, '/login'),
};

export const PATH_EXTERNAL = {
  denied: path(ROOT_EXTERNAL, '/denied'),
};
