import { useContext } from 'react';

// contexts
import { SettingsContext } from '../contexts/SettingsContext';

const useSettings = () => useContext(SettingsContext);
export default useSettings;
