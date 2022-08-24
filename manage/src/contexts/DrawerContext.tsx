import { ReactNode, useState, createContext } from 'react';
import type { DrawerProps } from 'antd';

// components
import { ComponentKey } from '../components/Drawer';

interface DrawerContextStates extends DrawerProps {
  isVisible: boolean;
  key: ComponentKey;
  props?: any;
  sub?: DrawerContextStates;
}

interface DrawerContextMethods {
  openDrawer: (params: Omit<DrawerContextStates, 'isVisible'>) => void;
  openSubDrawer: (subParams: Omit<DrawerContextStates, 'isVisible'>) => void;
  closeDrawer: () => void;
  closeSubDrawer: () => void;
}

const initialState: DrawerContextStates = {
  isVisible: false,
  key: 'default',
  props: undefined,
};

const DrawerContext = createContext<DrawerContextStates & DrawerContextMethods>({
  ...initialState,
  openDrawer: () => {},
  openSubDrawer: () => {},
  closeDrawer: () => {},
  closeSubDrawer: () => {},
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
  const openSubDrawer = (params: Omit<DrawerContextStates, 'isVisible'>) => {
    setState({
      ...state,
      sub: {
        isVisible: true,
        ...params,
      },
    });
  };
  const closeDrawer = () => {
    setState(initialState);
  };
  const closeSubDrawer = () => {
    setState({
      ...state,
      sub: undefined,
    });
  };
  return (
    <DrawerContext.Provider
      value={{ ...state, openDrawer, openSubDrawer, closeDrawer, closeSubDrawer }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export { DrawerProvider, DrawerContext };
