const webpack = require('webpack');

module.exports = function override(config, env) {
	config.resolve.fallback = {
		process: require.resolve('process/browser'),
		stream: require.resolve('stream-browserify'),
		zlib: require.resolve('browserify-zlib'),
		util: require.resolve('util'),
		buffer: require.resolve('buffer'),
		asset: require.resolve('assert'),
	};
	config.plugins.push(
		new webpack.ProvidePlugin({
			process: 'process/browser',
			Buffer: ['buffer', 'Buffer'],
		})
	);
	return config;
};
