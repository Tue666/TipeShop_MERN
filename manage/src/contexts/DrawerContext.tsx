import { ReactNode, useState, createContext } from 'react';
import type { DrawerProps } from 'antd';

// components
import { ComponentKey } from '../components/Drawer';

interface DrawerContextStates {
  isVisible: boolean;
  key: ComponentKey;
  title?: string;
  placement?: DrawerProps['placement'];
  props?: any;
}

interface DrawerContextMethods {
  openDrawer: (params: Omit<DrawerContextStates, 'isVisible'>) => void;
  closeDrawer: () => void;
}

const initialState: DrawerContextStates = {
  isVisible: false,
  key: 'default',
  props: undefined,
};

const DrawerContext = createContext<DrawerContextStates & DrawerContextMethods>({
  ...initialState,
  openDrawer: () => {},
  closeDrawer: () => {},
});

interface DrawerProviderProps {
  children: ReactNode;
}

const DrawerProvider = ({ children }: DrawerProviderProps) => {
  const [state, setState] = useState(initialState);

  const openDrawer = (params: Omit<DrawerContextStates, 'isVisible'>) => {
    setState({
      ...state,
      isVisible: true,
      ...params,
    });
  };
  const closeDrawer = () => {
    setState(initialState);
  };
  return (
    <DrawerContext.Provider value={{ ...state, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

export { DrawerProvider, DrawerContext };
