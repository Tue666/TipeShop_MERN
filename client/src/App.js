// components
import { LiveChat } from './components/live-chat';
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
// utils
import { SnackbarUtilsConfigurator } from './utils/snackbar';

const App = () => {
	const { isInitialized } = useAuth();
	return isInitialized ? (
		<ThemeConfig>
			<LiveChat />
			<ScrollToTop />
			<SnackbarUtilsConfigurator />
			<Modal />
			<Router />
		</ThemeConfig>
	) : (
		<Loading />
	);
};

export default App;
