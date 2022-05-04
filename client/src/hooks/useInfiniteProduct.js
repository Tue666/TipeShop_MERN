import { useState, useEffect } from 'react';

// apis
import productApi from '../apis/productApi';

const useInfiniteProduct = (page, number) => {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMore, setHasMore] = useState(false);
	useEffect(() => {
		const getProducts = async () => {
			setIsLoading(true);
			const res = await productApi.findAllWithPagination(page, number);
			setProducts((prevProducts) => {
				return [...prevProducts, ...res.products];
			});
			setIsLoading(false);
			setHasMore(page < res.pagination.totalPage);
		};
		getProducts();
	}, [page, number]);
	return { isLoading, hasMore, products };
};

export default useInfiniteProduct;
