import { node } from 'prop-types';
import { useEffect, useReducer, createContext } from 'react';

// apis
import accountApi from '../apis/accountApi';
// utils
import { getToken, setToken, isValidToken } from '../utils/jwt';

const initialState = {
	isInitialized: false,
	isAuthenticated: false,
};

const handlers = {
	INITIALIZE: (state, action) => {
		const isAuthenticated = action.payload;
		return {
			...state,
			isAuthenticated,
			isInitialized: true,
		};
	},
	LOGIN: (state) => {
		return {
			...state,
			isAuthenticated: true,
		};
	},
	LOGOUT: (state) => {
		return {
			...state,
			isAuthenticated: false,
		};
	},
};

const reducer = (state, action) =>
	handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
	...initialState,
	login: () => Promise.resolve(),
	logout: () => Promise.resolve(),
});

const propTypes = {
	children: node,
};

const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	useEffect(() => {
		const initialize = async () => {
			try {
				const tokens = getToken();
				setToken(tokens);
				const isAuthenticated = await isValidToken(tokens);
				dispatch({
					type: 'INITIALIZE',
					payload: isAuthenticated,
				});
			} catch (error) {
				console.log(error);
			}
		};
		initialize();
	}, []);

	const login = async (phone_number, password) => {
		const response = await accountApi.login({
			phone_number,
			password,
		});
		const { name, tokens } = response;
		setToken(tokens);
		dispatch({ type: 'LOGIN' });
		return name;
	};
	const logout = () => {
		setToken(null);
		dispatch({
			type: 'LOGOUT',
		});
	};
	return (
		<AuthContext.Provider
			value={{
				...state,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = propTypes;

export { AuthProvider, AuthContext };
