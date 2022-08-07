import { ReactNode, useEffect, useReducer, createContext } from 'react';

// apis
import accountApi from '../apis/accountApi';
// utils
import { TokenProps, getToken, setToken, isValidToken } from '../utils/jwt';

export interface PermissionProps {
  object: string;
  actions: string[];
}

export interface ProfileProps {
  profile: {
    [key: string]: any;
  } | null;
  permissions: PermissionProps[] | null;
  [key: string]: any;
}

interface AuthContextStates {
  isInitialized: boolean;
  isAuthenticated: boolean;
  profile: ProfileProps['profile'];
  permissions: ProfileProps['permissions'];
}

export interface LoginParams {
  phone_number: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  tokens: TokenProps;
}

interface AuthContextMethods {
  login: (params: LoginParams) => Promise<string>;
}

const initialState: AuthContextStates = {
  isInitialized: false,
  isAuthenticated: false,
  profile: null,
  permissions: null,
};
const AuthContext = createContext<AuthContextStates & AuthContextMethods>({
  ...initialState,
  login: () => Promise.resolve(''),
});

enum HandleType {
  INITIALIZE = 'INITIALIZE',
  LOGIN = 'LOGIN',
}

interface PayloadAction<T> {
  type: HandleType;
  payload: T;
}

const handlers: {
  [key in HandleType]: (state: AuthContextStates, action?: PayloadAction<any>) => AuthContextStates;
} = {
  [HandleType.INITIALIZE]: (state, action) => {
    return {
      ...state,
      isInitialized: true,
      ...action?.payload,
    };
  },
  [HandleType.LOGIN]: (state, action) => {
    return {
      ...state,
      isAuthenticated: true,
      ...action?.payload,
    };
  },
};

const reducer = (state: AuthContextStates, action: PayloadAction<any>): AuthContextStates =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initNecessaryData = async (): Promise<ProfileProps> => {
    const response = await accountApi.getProfile();
    // fetch data depend permissions
    return response;
  };
  useEffect(() => {
    const initialize = async () => {
      try {
        const tokens = getToken();
        setToken(tokens);
        const isAuthenticated = await isValidToken(tokens);
        if (isAuthenticated) {
          const { profile, permissions } = await initNecessaryData();
          dispatch({
            type: HandleType.INITIALIZE,
            payload: {
              isAuthenticated,
              profile,
              permissions,
            },
          });
        } else {
          dispatch({
            type: HandleType.INITIALIZE,
            payload: {
              isAuthenticated: false,
            },
          });
        }
      } catch (error) {
        // console.log('zxc', error);
      }
    };
    initialize();
  }, []);

  const login = async (params: LoginParams): Promise<string> => {
    const response = await accountApi.login(params);
    const { name, tokens } = response;
    setToken(tokens);
    const { profile, permissions } = await initNecessaryData();
    dispatch({
      type: HandleType.LOGIN,
      payload: {
        profile,
        permissions,
      },
    });
    return name;
  };
  return <AuthContext.Provider value={{ ...state, login }}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
