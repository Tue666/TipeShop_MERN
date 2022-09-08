import { ReactNode, useEffect, useReducer, createContext } from 'react';
import { Space, Modal } from 'antd';

// apis
import type { GetProfileResponse, LoginParams } from '../apis/accountApi';
import accountApi from '../apis/accountApi';
import accessControlApi from '../apis/accessControlApi';
// config
import type { ResourceConfig } from '../config';
import { generateResources, filterAccessibleResources } from '../config';
// models
import type { Nullable, Permission, ReducerPayloadAction, Resource, Role } from '../models';
// redux
import { useAppDispatch } from '../redux/hooks';
import { initializeAccessControl } from '../redux/slices/accessControl';
// utils
import { getToken, setToken, isValidToken } from '../utils/jwt';

interface AuthContextStates extends Nullable<GetProfileResponse> {
  isInitialized: boolean;
  isAuthenticated: boolean;
  permissions: Permission[];
  accessibleResources: ResourceConfig[];
}

interface AuthContextMethods {
  refreshAccessibleResources: (
    resources: Resource[],
    roles: Role[],
    rolesAllowed?: GetProfileResponse['profile']['roles'],
    firstInit?: boolean
  ) => Pick<AuthContextStates, 'permissions' | 'accessibleResources'>;
  login: (params: LoginParams) => Promise<string>;
  logout: () => void;
}

const initialState: AuthContextStates = {
  isInitialized: false,
  isAuthenticated: false,
  profile: null,
  permissions: [],
  accessibleResources: [],
};
const AuthContext = createContext<AuthContextStates & AuthContextMethods>({
  ...initialState,
  refreshAccessibleResources: () =>
    ({} as Pick<AuthContextStates, 'permissions' | 'accessibleResources'>),
  login: () => Promise.resolve(''),
  logout: () => {},
});

enum HandleType {
  INITIALIZE = 'INITIALIZE',
  REFRESH_ACCESSIBLE_RESOURCES = 'REFRESH_ACCESSIBLE_RESOURCES',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

const handlers: {
  [key in HandleType]: (
    state: AuthContextStates,
    action?: ReducerPayloadAction<any, HandleType>
  ) => AuthContextStates;
} = {
  [HandleType.INITIALIZE]: (state, action) => {
    return {
      ...state,
      isInitialized: true,
      ...action?.payload,
    };
  },
  [HandleType.REFRESH_ACCESSIBLE_RESOURCES]: (state, action) => {
    return {
      ...state,
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
  [HandleType.LOGOUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      profile: null,
      permissions: [],
      accessibleResources: [],
    };
  },
};

const reducer = (
  state: AuthContextStates,
  action: ReducerPayloadAction<any, HandleType>
): AuthContextStates => (handlers[action.type] ? handlers[action.type](state, action) : state);

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
  const refreshAccessibleResources = (
    resources: Resource[],
    roles: Role[],
    rolesAllowed = state.profile?.roles,
    firstInit = false
  ) => {
    const permissions = roles.reduce((acc, role) => {
      const { name, permissions } = role;
      if (!rolesAllowed) return acc;
      else if (rolesAllowed.indexOf(name) >= 0) return [...acc, ...permissions];
      return acc;
    }, [] as Permission[]);
    const resourcesAllowed = [
      ...Array.from(
        new Set(
          permissions?.reduce(
            (result, permission) => [...result, ...permission.resource],
            [] as Permission['resource']
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
    // only refresh if not first initialization
    !firstInit &&
      dispatch({
        type: HandleType.REFRESH_ACCESSIBLE_RESOURCES,
        payload: {
          permissions,
          accessibleResources,
        },
      });
    return { permissions, accessibleResources };
  };
  const initRequiredData = async (): Promise<
    Omit<AuthContextStates, 'isInitialized' | 'isAuthenticated'>
  > => {
    const [roles, resources, operations] = await Promise.all([
      accessControlApi.findAllRoles(),
      accessControlApi.findAllResourcesWithNested(),
      accessControlApi.findAllOperations(),
    ]);
    sliceDispatch(initializeAccessControl({ roles, resources, operations }));

    const account = await accountApi.getProfile();
    const { profile } = account;
    const { permissions, accessibleResources } = refreshAccessibleResources(
      resources,
      roles,
      profile.roles,
      true
    );
    return { profile, permissions, accessibleResources };
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
        Modal.error({
          centered: true,
          title: 'Something went wrong!',
          content: (
            <Space direction="vertical">
              <span>Please reload the page</span>
              <span>
                If this problem does not go away,{' '}
                <a href="https://www.facebook.com/exe.shiro">contact us</a>
              </span>
            </Space>
          ),
          okText: 'Reload',
          onOk() {
            window.location.reload();
          },
        });
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
  const logout = () => {
    setToken(null);
    dispatch({
      type: HandleType.LOGOUT,
    });
  };
  return (
    <AuthContext.Provider value={{ ...state, refreshAccessibleResources, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
