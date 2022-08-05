const path = (root: string, sublink: string): string => {
  return `${root}${sublink}`;
};

const ROOT_DASHBOARD = '/';

const ROOT_PRODUCT = path(ROOT_DASHBOARD, 'product');
const ROOT_ACCESS_CONTROL = path(ROOT_DASHBOARD, 'access-control');

export const PATH_DASHBOARD = {
  root: ROOT_DASHBOARD,
  product: {
    root: ROOT_PRODUCT,
    list: path(ROOT_PRODUCT, '/list'),
  },
  accessControl: {
    root: ROOT_ACCESS_CONTROL,
    operations: path(ROOT_ACCESS_CONTROL, '/operations'),
  },
};
