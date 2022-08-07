import { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

// guards
import AuthGuard from '../guards/AuthGuard';
// layouts
import MainLayout from '../layouts/main';
// pages
import Loading from '../pages/external/Loading';

const PageLoader = (Component: React.LazyExoticComponent<() => JSX.Element>) => () => {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

const Router = () => {
  return useRoutes([
    // Auth routes
    {
      path: 'auth',
      children: [
        { path: '', element: <Navigate to="/auth/login" replace /> },
        { path: 'login', element: <Login /> },
      ],
    },
    // Main routes
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        { path: '', element: <Dashboard /> },
        { path: 'product/list', element: <ProductList /> },
        { path: 'access-control/operations', element: <Operations /> },
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

// Auth
const Login = PageLoader(lazy(() => import('../pages/Login')));
// Main
const Dashboard = PageLoader(lazy(() => import('../pages/Dashboard')));
const ProductList = PageLoader(lazy(() => import('../pages/product/ProductList')));
const Operations = PageLoader(lazy(() => import('../pages/access-control/Operations')));
// External
const NotFound = PageLoader(lazy(() => import('../pages/external/NotFound')));

export default Router;
