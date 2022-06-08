import { node } from 'prop-types';
import { useEffect, useReducer, createContext } from 'react';
import { useDispatch } from 'react-redux';

// apis
import accountApi from '../apis/accountApi';
// redux
import { getProfile, clearAccount } from '../redux/slices/account';
import { getCart, clearCart } from '../redux/slices/cart';
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
	socialLogin: () => Promise.resolve(),
	register: () => Promise.resolve(),
	logout: () => Promise.resolve(),
});

const propTypes = {
	children: node,
};

const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const dispatchSlice = useDispatch();
	useEffect(() => {
		const initialize = async () => {
			try {
				const tokens = getToken();
				setToken(tokens);
				const isAuthenticated = await isValidToken(tokens);
				if (isAuthenticated) {
					dispatchSlice(getProfile());
					dispatchSlice(getCart());
				}
				dispatch({
					type: 'INITIALIZE',
					payload: isAuthenticated,
				});
			} catch (error) {
				console.log(error);
				dispatch({
					type: 'INITIALIZE',
					payload: false,
				});
			}
		};
		initialize();
	}, [dispatchSlice]);

	const login = async (phone_number, password) => {
		const response = await accountApi.login({
			phone_number,
			password,
		});
		const { name, tokens } = response;
		setToken(tokens);
		dispatchSlice(getProfile());
		dispatchSlice(getCart());
		dispatch({ type: 'LOGIN' });
		return name;
	};
	const socialLogin = async (body) => {
		const response = await accountApi.socialLogin(body);
		const { name, tokens } = response;
		setToken(tokens);
		dispatchSlice(getProfile());
		dispatchSlice(getCart());
		dispatch({ type: 'LOGIN' });
		return name;
	};
	const register = async (body) => {
		const response = await accountApi.register(body);
		const { name, tokens } = response;
		setToken(tokens);
		dispatchSlice(getProfile());
		dispatchSlice(getCart());
		dispatch({ type: 'LOGIN' });
		return name;
	};
	const logout = () => {
		setToken(null);
		dispatchSlice(clearAccount());
		dispatchSlice(clearCart());
		dispatch({
			type: 'LOGOUT',
		});
	};
	return (
		<AuthContext.Provider
			value={{
				...state,
				login,
				socialLogin,
				register,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = propTypes;

export { AuthProvider, AuthContext };
