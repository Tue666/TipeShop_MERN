// components
import { ScrollToTop } from './components/ScrollToTop';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';

const App = () => {
	return (
		<ThemeConfig>
			<ScrollToTop />
			<Router />
		</ThemeConfig>
	);
};

export default App;
