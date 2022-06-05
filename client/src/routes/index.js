import { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

import Loading from '../pages/Loading';
// layouts
import MainLayout from '../layouts/main';
import CustomerLayout from '../layouts/customer';
import CheckoutLayout from '../layouts/checkout';

const PageLoader = (Component) => (props) => {
	return (
		<Suspense fallback={<Loading />}>
			<Component {...props} />
		</Suspense>
	);
};

const Router = () => {
	return useRoutes([
		// Checkout routes
		{
			path: '/checkout',
			element: <CheckoutLayout />,
			children: [
				{ path: '', element: <Navigate to="/checkout/shipping" replace /> },
				{ path: 'shipping', element: <Shipping /> },
				{ path: 'payment', element: <Payment /> },
				{ path: 'result', element: <Result /> },
			],
		},
		// Main routes
		{
			path: '/',
			element: <MainLayout />,
			children: [
				{ path: '', element: <Home /> },
				{ path: 'cart', element: <Cart /> },
				{
					path: 'customer',
					element: <CustomerLayout />,
					children: [
						{ path: '', element: <Navigate to="/customer/profile" replace /> },
						{ path: 'profile', element: <Profile /> },
						{ path: 'addresses', element: <Addresses /> },
						{ path: 'addresses/create', element: <AddressForm /> },
						{ path: 'addresses/edit/:_id', element: <AddressForm /> },
						{ path: 'orders', element: <Orders /> },
					],
				},
				{ path: ':slug/pid:_id', element: <Product /> },
				{ path: ':slug/cid:_id', element: <Category /> },
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
const Cart = PageLoader(lazy(() => import('../pages/Cart')));
const Product = PageLoader(lazy(() => import('../pages/Product')));
const Category = PageLoader(lazy(() => import('../pages/Category')));
const NotFound = PageLoader(lazy(() => import('../pages/NotFound')));
// Profile
const Profile = PageLoader(lazy(() => import('../pages/customer/Profile')));
const Addresses = PageLoader(lazy(() => import('../pages/customer/Addresses')));
const AddressForm = PageLoader(lazy(() => import('../pages/customer/AddressForm')));
const Orders = PageLoader(lazy(() => import('../pages/customer/Orders')));
// Checkout
const Shipping = PageLoader(lazy(() => import('../pages/checkout/Shipping')));
const Payment = PageLoader(lazy(() => import('../pages/checkout/Payment')));
const Result = PageLoader(lazy(() => import('../pages/checkout/Result')));
