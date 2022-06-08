// _external_
// slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// lazy-load
import 'react-lazy-load-image-component/src/effects/blur.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { ConfirmProvider } from 'material-ui-confirm';
import { SnackbarProvider } from 'notistack';
import { AxiosInterceptor } from './apis/axiosInstance';
import { GoogleOAuthProvider } from '@react-oauth/google';

// contexts
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
// redux
import store from './redux/store';
// config
import { googleConfig } from './config';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<HelmetProvider>
		<ReduxProvider store={store}>
			<GoogleOAuthProvider clientId={googleConfig.clientId}>
				<SettingsProvider>
					<ConfirmProvider>
						<SnackbarProvider maxSnack={4}>
							<AuthProvider>
								<AxiosInterceptor>
									<BrowserRouter>
										<App />
									</BrowserRouter>
								</AxiosInterceptor>
							</AuthProvider>
						</SnackbarProvider>
					</ConfirmProvider>
				</SettingsProvider>
			</GoogleOAuthProvider>
		</ReduxProvider>
	</HelmetProvider>
);
