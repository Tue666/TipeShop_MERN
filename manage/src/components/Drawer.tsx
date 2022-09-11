import { Drawer as AntDrawer } from 'antd';

// components
import { ResourceForm, OperationForm, RoleForm } from './access-control';
// hooks
import useDrawer from '../hooks/useDrawer';

const components = {
  default: () => null,
  roleForm: (props?: any) => <RoleForm {...props} />,
  resourceForm: (props?: any) => <ResourceForm {...props} />,
  operationForm: (props?: any) => <OperationForm {...props} />,
};

export type ComponentKey = keyof typeof components;

const Drawer = () => {
  const { isVisible, key, props, sub, closeDrawer, closeSubDrawer, ...params } = useDrawer();
  return (
    <AntDrawer open={isVisible} onClose={closeDrawer} {...params}>
      {components[key](props)}
      {sub && (
        <AntDrawer visible={sub.isVisible} onClose={closeSubDrawer} {...params}>
          {components[sub.key](sub.props)}
        </AntDrawer>
      )}
    </AntDrawer>
  );
};

export default Drawer;
