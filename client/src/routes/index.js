import { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

import Loading from '../pages/Loading';
// layouts
import MainLayout from '../layouts/main';

const PageLoader = (Component) => (props) => {
	return (
		<Suspense fallback={<Loading />}>
			<Component {...props} />
		</Suspense>
	);
};

const Router = () => {
	return useRoutes([
		// Main routes
		{
			path: '/',
			element: <MainLayout />,
			children: [
				{ path: '', element: <Home /> },
				{ path: '/:slug/cid:_id', element: <Category /> },
			],
		},
		// Not matched any routes
		{
			path: '*',
			children: [
				{ path: '*', element: <Navigate to="/404" replace /> },
				{ path: '404', element: <NotFound /> },
			],
		},
	]);
};

export default Router;

// Main
const Home = PageLoader(lazy(() => import('../pages/Home')));
const Category = PageLoader(lazy(() => import('../pages/Category')));
const NotFound = PageLoader(lazy(() => import('../pages/NotFound')));
