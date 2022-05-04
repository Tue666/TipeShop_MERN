import { useState, useEffect, useMemo, Fragment } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Container, Stack, Skeleton } from '@mui/material';

// apis
import categoryApi from '../apis/categoryApi';
// components
import Page from '../components/Page';
import Teleport from '../components/Teleport';
import Breadcrumbs from '../components/Breadcrumbs';
import { Filter, Result } from '../components/category';

const Category = () => {
	const [category, setCategory] = useState(null);
	const { _id } = useParams();
	const { pathname, search } = useLocation();
	const navigate = useNavigate();
	let searchParams = useMemo(
		() => new URLSearchParams(search ? search : 'sort=default&page=1'),
		[search]
	);
	useEffect(() => {
		const getCategory = async () => {
			const queryParams = Object.fromEntries(searchParams);
			console.log(queryParams);

			let category = await categoryApi.findById(_id);
			const { children, attributes, ...parts } = category;
			setCategory({
				...parts,
				filter: {
					children,
					attributes,
				},
			});
		};
		getCategory();
	}, [_id, searchParams]);

	const handleNavigate = (key, value, multiple = false) => {
		value = value.toString();
		// key not exists
		if (!searchParams.has(key)) searchParams.append(key, value);
		else {
			// key not includes multiple values
			if (!multiple) searchParams.set(key, value);
			else {
				const keyValue = searchParams.get(key);
				const arrayValue = keyValue.split(',');
				const newValue =
					arrayValue.indexOf(value) > -1 ? arrayValue.filter((x) => x !== value) : [...arrayValue, value];
				newValue.length !== 0 ? searchParams.set(key, newValue.toString()) : searchParams.delete(key);
			}
		}
		navigate({
			pathname,
			search: `?${searchParams}`,
		});
		window.scrollTo(0, 0);
	};
	return (
		<Page title={`Buy online ${category?.name || 'at'} good price | Tipe Shop`}>
			<Container>
				<Teleport />
				{category && (
					<Fragment>
						<Breadcrumbs
							header={category.name}
							links={category.parent.map((item) => ({
								title: item.name,
								href: `/${item.slug}/cid${item._id}`,
							}))}
						/>
						<Stack direction={{ xs: 'column', sm: 'row', lg: 'row' }} justifyContent="space-between">
							<Filter
								queryParams={Object.fromEntries(searchParams)}
								filter={category.filter}
								handleNavigate={handleNavigate}
							/>
							<Result />
						</Stack>
					</Fragment>
				)}
				{!category && (
					<Stack direction={{ xs: 'column', sm: 'row', lg: 'row' }} justifyContent="space-between">
						<FilterSkeleton>
							{[...Array(3)].map((_, index) => (
								<Stack key={index} sx={{ mb: 3 }}>
									<Skeleton variant="text" height={50} />
									{[...Array(4)].map((_, index) => (
										<Fragment key={index}>
											<Skeleton variant="text" />
											<Skeleton variant="text" width={200} />
										</Fragment>
									))}
								</Stack>
							))}
						</FilterSkeleton>
						<ResultSkeleton>
							<Skeleton variant="text" width={300} height={50} />
							<Skeleton variant="text" height={50} />
							<Wrapper>
								{[...Array(12)].map((_, index) => (
									<Stack key={index} sx={{ p: 2 }}>
										<Skeleton variant="rectangular" width={180} height={180} />
										<Skeleton variant="text" height={45} />
										<Skeleton variant="text" width={150} />
										<Skeleton variant="text" width={130} />
									</Stack>
								))}
							</Wrapper>
						</ResultSkeleton>
					</Stack>
				)}
			</Container>
		</Page>
	);
};

const FilterSkeleton = styled(Stack)(({ theme }) => ({
	width: '262px',
	borderRight: `2px solid ${theme.palette.background.default}`,
	backgroundColor: theme.palette.background.paper,
	padding: '10px',
	[theme.breakpoints.down('sm')]: {
		width: '100%',
		marginBottom: '10px',
	},
}));

const ResultSkeleton = styled(Stack)(({ theme }) => ({
	padding: '15px',
	width: 'calc(100% - 262px)',
	backgroundColor: theme.palette.background.paper,
	[theme.breakpoints.down('sm')]: {
		width: '100%',
	},
}));

const Wrapper = styled('div')({
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
});

export default Category;
