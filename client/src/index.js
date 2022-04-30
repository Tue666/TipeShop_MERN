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

// contexts
import { SettingsProvider } from './contexts/SettingsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<HelmetProvider>
		<SettingsProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</SettingsProvider>
	</HelmetProvider>
);
