import Cookies from 'js-cookie';

// apis
import axiosInstance from '../apis/axiosInstance';
import accountApi from '../apis/accountApi';

export interface TokenProps {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

const getToken = (): TokenProps | null => {
  const accessToken = Cookies.get('accessToken');
  return accessToken ? JSON.parse(accessToken) : null;
};

const setToken = (tokens: TokenProps | null) => {
  if (tokens) {
    Cookies.set('accessToken', JSON.stringify(tokens), { expires: 2 });
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
  } else {
    Cookies.remove('accessToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

const isValidToken = async (tokens: TokenProps | null): Promise<boolean> => {
  if (!tokens) return false;
  return await accountApi.verifyToken();
};

export { getToken, setToken, isValidToken };
