const path = (root: string, sublink: string): string => {
  return `${root}${sublink}`;
};

const ROOT_DASHBOARD = '/';
const ROOT_AUTH = '/auth';
const ROOT_EXTERNAL = '/external';

const ROOT_ACCOUNT = path(ROOT_DASHBOARD, 'accounts');
const ROOT_PRODUCT = path(ROOT_DASHBOARD, 'products');
const ROOT_ACCESS_CONTROL = path(ROOT_DASHBOARD, 'access-control');
const ROOT_RECYCLE_BIN = path(ROOT_DASHBOARD, 'recycle-bin');

export const PATH_DASHBOARD = {
  root: ROOT_DASHBOARD,
  customerService: path(ROOT_DASHBOARD, 'customer-service'),
  account: {
    root: ROOT_ACCOUNT,
    administrators: path(ROOT_ACCOUNT, '/administrators'),
    customers: path(ROOT_ACCOUNT, '/customers'),
    create: (type: String | undefined) => path(ROOT_ACCOUNT, `/${type}/create`),
    edit: (type: string | undefined, _id: string) => path(ROOT_ACCOUNT, `/${type}/edit/${_id}`),
  },
  products: {
    root: ROOT_PRODUCT,
    productList: path(ROOT_PRODUCT, '/list'),
    categories: path(ROOT_PRODUCT, '/categories'),
  },
  accessControl: {
    root: ROOT_ACCESS_CONTROL,
    roles: path(ROOT_ACCESS_CONTROL, '/roles'),
    resources: path(ROOT_ACCESS_CONTROL, '/resources'),
    operations: path(ROOT_ACCESS_CONTROL, '/operations'),
  },
  recycleBin: {
    root: ROOT_RECYCLE_BIN,
    operations: path(ROOT_RECYCLE_BIN, '/operations'),
  },
};

export const PATH_AUTH = {
  login: path(ROOT_AUTH, '/login'),
};

export const PATH_EXTERNAL = {
  denied: path(ROOT_EXTERNAL, '/denied'),
};
