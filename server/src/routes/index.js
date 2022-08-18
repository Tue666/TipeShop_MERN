// routes
const accountsRouter = require('./accounts');
const productsRouter = require('./products');
const cartsRouter = require('./carts');
const categoriesRouter = require('./categories');
const propertiesRouter = require('./properties');
const locationsRouter = require('./locations');
const ordersRouter = require('./orders');
const paymentRouter = require('./payment');
const operationsRouter = require('./operations');
const resourcesRouter = require('./resources');
const rolesRouter = require('./roles');

const initialRoutes = (app) => {
	app.use('/api/accounts', accountsRouter);
	app.use('/api/products', productsRouter);
	app.use('/api/carts', cartsRouter);
	app.use('/api/categories', categoriesRouter);
	app.use('/api/properties', propertiesRouter);
	app.use('/api/locations', locationsRouter);
	app.use('/api/orders', ordersRouter);
	app.use('/api/payment', paymentRouter);
	app.use('/api/operations', operationsRouter);
	app.use('/api/resources', resourcesRouter);
	app.use('/api/roles', rolesRouter);
};

module.exports = initialRoutes;
