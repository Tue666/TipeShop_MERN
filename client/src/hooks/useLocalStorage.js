import { useState } from 'react';

const useLocalStorage = (key, defaultValue) => {
	const [value, setValue] = useState(() => {
		const storedValue = localStorage.getItem(key);
		return storedValue === null ? defaultValue : JSON.parse(storedValue);
	});

	const setValueStorage = (newValue) => {
		setValue((currentValue) => {
			const result = typeof newValue === 'function' ? newValue(currentValue) : newValue;
			localStorage.setItem(key, JSON.stringify(newValue));
			return result;
		});
	};

	return [value, setValueStorage];
};

export default useLocalStorage;
