// external
import 'antd/dist/antd.variable.min.css';
import './theme/globalSelectors.css';

import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { AxiosInterceptor } from './apis/axiosInstance';
// contexts
import { SocketProvider } from './contexts/SocketContext';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { DrawerProvider } from './contexts/DrawerContext';
// redux
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <SocketProvider>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <DrawerProvider>
          <AuthProvider>
            <AxiosInterceptor>
              <SettingsProvider>
                <App />
              </SettingsProvider>
            </AxiosInterceptor>
          </AuthProvider>
        </DrawerProvider>
      </BrowserRouter>
    </ReduxProvider>
  </SocketProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
