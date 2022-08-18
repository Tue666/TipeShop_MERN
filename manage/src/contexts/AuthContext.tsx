import { ReactNode, useEffect, useReducer, createContext } from 'react';

// apis
import accountApi from '../apis/accountApi';
import accessControlApi from '../apis/accessControlApi';
// config
import type { ResourceConfig } from '../config';
import { generateResources, filterAccessibleResources } from '../config';
// models
import type { Permission } from '../models';
// redux
import { useAppDispatch } from '../redux/hooks';
import { initializeAccessControl } from '../redux/slices/accessControl';
// utils
import { TokenProps, getToken, setToken, isValidToken } from '../utils/jwt';

export interface ProfileProps {
  profile: {
    [key: string]: any;
  } | null;
  permissions: Permission[] | null;
}

interface AuthContextStates extends ProfileProps {
  isInitialized: boolean;
  isAuthenticated: boolean;
  accessibleResources: ResourceConfig[];
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
  accessibleResources: [],
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
  const sliceDispatch = useAppDispatch();

  const initNecessaryData = (resources: ResourceConfig[]): void => {
    resources.forEach((resource) => {
      if (resource) {
        const { fetching, children } = resource;
        if (fetching) sliceDispatch(fetching);
        if (children) initNecessaryData(children);
      }
    });
  };
  const initRequiredData = async (): Promise<
    Omit<AuthContextStates, 'isInitialized' | 'isAuthenticated'>
  > => {
    const [resources, operations] = await Promise.all([
      accessControlApi.findAllResourceWithNested(),
      accessControlApi.findAllOperation(),
    ]);
    sliceDispatch(initializeAccessControl({ resources, operations }));

    const account = await accountApi.getProfile();
    const { permissions, profile } = account;
    const resourcesAllowed = [
      ...Array.from(
        new Set(
          permissions?.reduce(
            (result, permission) => [...result, ...permission.resource.split('/')],
            [] as Permission['resource'][]
          )
        )
      ),
    ];
    const accessibleResources = filterAccessibleResources(
      generateResources(resources),
      resourcesAllowed
    );
    // fetch data depend accessible objects
    initNecessaryData(accessibleResources);
    return { permissions, profile, accessibleResources };
  };
  useEffect(() => {
    const initialize = async () => {
      try {
        const tokens = getToken();
        setToken(tokens);
        const isAuthenticated = await isValidToken(tokens);
        if (isAuthenticated) {
          const { profile, permissions, accessibleResources } = await initRequiredData();
          dispatch({
            type: HandleType.INITIALIZE,
            payload: {
              isAuthenticated,
              profile,
              permissions,
              accessibleResources,
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
    // eslint-disable-next-line
  }, []);

  const login = async (params: LoginParams): Promise<string> => {
    const response = await accountApi.login(params);
    const { name, tokens } = response;
    setToken(tokens);
    const { profile, permissions, accessibleResources } = await initRequiredData();
    dispatch({
      type: HandleType.LOGIN,
      payload: {
        profile,
        permissions,
        accessibleResources,
      },
    });
    return name;
  };
  return <AuthContext.Provider value={{ ...state, login }}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
