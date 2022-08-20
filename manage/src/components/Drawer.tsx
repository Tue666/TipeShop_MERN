import { Drawer as AntDrawer } from 'antd';

// components
import { ResourceForm, OperationForm } from './access-control';
// hooks
import useDrawer from '../hooks/useDrawer';

const components = {
  default: () => null,
  resourceForm: (props?: any) => <ResourceForm {...props} />,
  operationForm: (props?: any) => <OperationForm {...props} />,
};

export type ComponentKey = keyof typeof components;

const Drawer = () => {
  const { isVisible, key, props, closeDrawer, ...params } = useDrawer();
  return (
    <AntDrawer visible={isVisible} onClose={closeDrawer} {...params}>
      {components[key](props)}
    </AntDrawer>
  );
};

export default Drawer;
