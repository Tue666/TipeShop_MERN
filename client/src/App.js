// components
import { ScrollToTop } from './components/ScrollToTop';
import Modal from './components/Modal';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';

const App = () => {
	return (
		<ThemeConfig>
			<ScrollToTop />
			<Modal />
			<Router />
		</ThemeConfig>
	);
};

export default App;
