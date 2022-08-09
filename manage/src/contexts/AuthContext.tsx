import { ReactNode, useEffect, useReducer, createContext } from 'react';

// apis
import accountApi from '../apis/accountApi';
// config
import { PermissionProps, ObjectProps, filterAccessibleObjects, OBJECTS } from '../config';
// redux
import { useAppDispatch } from '../redux/hooks';
// utils
import { TokenProps, getToken, setToken, isValidToken } from '../utils/jwt';

export interface ProfileProps {
  profile: {
    [key: string]: any;
  } | null;
  permissions: PermissionProps[] | null;
  [key: string]: any;
}

interface AuthContextStates extends ProfileProps {
  isInitialized: boolean;
  isAuthenticated: boolean;
  accessibleObjects: ObjectProps[];
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
  accessibleObjects: [],
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

  const initNecessaryData = (objects: ObjectProps[]): void => {
    objects.forEach((object: ObjectProps) => {
      const { fetching, children } = object;
      if (fetching) sliceDispatch(fetching);
      if (children) initNecessaryData(children);
    });
  };
  const getProfile = async (): Promise<
    ProfileProps & (AuthContextStates['accessibleObjects'] | {})
  > => {
    const response = await accountApi.getProfile();
    const { permissions, profile } = response;
    const accessible = [
      ...Array.from(
        new Set(
          permissions?.reduce(
            (
              result: PermissionProps['object'][],
              permission: PermissionProps
            ): PermissionProps['object'][] => [...result, ...permission.object.split('/')],
            []
          )
        )
      ),
    ];
    const accessibleObjects = filterAccessibleObjects(OBJECTS, accessible);
    // fetch data depend accessible objects
    initNecessaryData(accessibleObjects);
    return { permissions, profile, accessibleObjects };
  };
  useEffect(() => {
    const initialize = async () => {
      try {
        const tokens = getToken();
        setToken(tokens);
        const isAuthenticated = await isValidToken(tokens);
        if (isAuthenticated) {
          const { profile, permissions, accessibleObjects } = await getProfile();
          dispatch({
            type: HandleType.INITIALIZE,
            payload: {
              isAuthenticated,
              profile,
              permissions,
              accessibleObjects,
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
    const { profile, permissions, accessibleObjects } = await getProfile();
    dispatch({
      type: HandleType.LOGIN,
      payload: {
        profile,
        permissions,
        accessibleObjects,
      },
    });
    return name;
  };
  return <AuthContext.Provider value={{ ...state, login }}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
