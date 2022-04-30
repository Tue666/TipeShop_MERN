// routes
const productsRouter = require('./products');
const categoriesRouter = require('./categories');
const propertiesRouter = require('./properties');

const initialRoutes = (app) => {
	app.use('/api/products', productsRouter);
	app.use('/api/categories', categoriesRouter);
	app.use('/api/properties', propertiesRouter);
};

module.exports = initialRoutes;
