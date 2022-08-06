import { ReactNode, useEffect, useReducer, createContext } from 'react';

// apis
import accountApi from '../apis/accountApi';

interface PermissionProps {
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

interface AuthContextMethods {}

const initialState: AuthContextStates = {
  isInitialized: false,
  isAuthenticated: false,
  profile: null,
  permissions: null,
};
const AuthContext = createContext<AuthContextStates & AuthContextMethods>(initialState);

enum HandleType {
  INITIALIZE = 'INITIALIZE',
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
};

const reducer = (state: AuthContextStates, action: PayloadAction<any>): AuthContextStates =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const initialize = async () => {
      try {
        // check accessToken
        const isAuthenticated = false;
        // fetch profile if token valid
        if (isAuthenticated) {
          const response = await accountApi.getProfile();
          const { profile, permissions } = response;

          // fetch data depend permissions

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
        console.log(error);
      }
    };
    initialize();
  }, []);
  return <AuthContext.Provider value={{ ...state }}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
