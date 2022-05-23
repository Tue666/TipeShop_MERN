// components
import { ScrollToTop } from './components/ScrollToTop';
import Modal from './components/Modal';
// hooks
import useAuth from './hooks/useAuth';
// pages
import Loading from './pages/Loading';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';

const App = () => {
	const { isInitialized } = useAuth();
	return isInitialized ? (
		<ThemeConfig>
			<ScrollToTop />
			<Modal />
			<Router />
		</ThemeConfig>
	) : (
		<Loading />
	);
};

export default App;
