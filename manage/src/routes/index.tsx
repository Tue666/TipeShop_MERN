import { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

// config
import { accessibleObjectPath } from '../config';
// guards
import AuthGuard from '../guards/AuthGuard';
import AccessGuard from '../guards/AccessGuard';
// layouts
import MainLayout from '../layouts/main';
// pages
import Loading from '../pages/external/Loading';

const PageLoader =
  (Component: React.LazyExoticComponent<(props: any) => JSX.Element>) => (props: any) => {
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
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        { path: '', element: <Dashboard /> },
        {
          path: 'accounts/administrators',
          element: (
            <AccessGuard accessibleObject={accessibleObjectPath.accounts.administrators}>
              <AccountList />
            </AccessGuard>
          ),
        },
        {
          path: 'accounts/customers',
          element: (
            <AccessGuard accessibleObject={accessibleObjectPath.accounts.customers}>
              <AccountList />
            </AccessGuard>
          ),
        },
        {
          path: 'products/list',
          element: (
            <AccessGuard accessibleObject={accessibleObjectPath.products.list}>
              <ProductList />
            </AccessGuard>
          ),
        },
        {
          path: 'access-control/operations',
          element: (
            <AccessGuard accessibleObject={accessibleObjectPath.accessControl.operations}>
              <Operations />
            </AccessGuard>
          ),
        },
      ],
    },
    // Auth routes
    {
      path: 'auth',
      children: [
        { path: '', element: <Navigate to="/auth/login" replace /> },
        { path: 'login', element: <Login /> },
      ],
    },
    // External routes
    {
      path: 'external',
      children: [
        { path: '', element: <Navigate to="/external/denied" replace /> },
        { path: 'denied', element: <Denied /> },
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

// Main
const Dashboard = PageLoader(lazy(() => import('../pages/Dashboard')));
const AccountList = PageLoader(lazy(() => import('../pages/account/AccountList')));
const ProductList = PageLoader(lazy(() => import('../pages/product/ProductList')));
const Operations = PageLoader(lazy(() => import('../pages/access-control/Operations')));
// Auth
const Login = PageLoader(lazy(() => import('../pages/Login')));
// External
const Denied = PageLoader(lazy(() => import('../pages/external/Denied')));
const NotFound = PageLoader(lazy(() => import('../pages/external/NotFound')));
export default Router;
