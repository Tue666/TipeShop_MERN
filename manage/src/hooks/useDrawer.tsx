import { useContext } from 'react';

// contexts
import { DrawerContext } from '../contexts/DrawerContext';

const useDrawer = () => useContext(DrawerContext);

export default useDrawer;
