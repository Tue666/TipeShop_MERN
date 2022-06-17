import { Fragment, useState, useEffect, useRef, useReducer } from 'react';
import { Container, Stack, Typography, Link, Tooltip, Tabs, Tab, Skeleton } from '@mui/material';
import axios from 'axios';

// components
import Page from '../components/Page';
import Teleport from '../components/Teleport';
import Breadcrumbs from '../components/Breadcrumbs';
import ImageLoader from '../components/ImageLoader';
// constant
import { HEADER_HEIGHT } from '../constant';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'; // fix later

const NEWS_TABS = [
	{
		label: 'Newest',
		value: '/rss/tin-moi-nhat.rss',
	},
	{
		label: 'Hot',
		value: '/rss/tin-noi-bat.rss',
	},
	{
		label: 'Top view',
		value: '/rss/tin-xem-nhieu.rss',
	},
	{
		label: 'World',
		value: '/rss/the-gioi.rss',
	},
	{
		label: 'News',
		value: '/rss/thoi-su.rss',
	},
	{
		label: 'Business',
		value: '/rss/kinh-doanh.rss',
	},
	{
		label: 'Entertainment',
		value: '/rss/giai-tri.rss',
	},
	{
		label: 'Sport',
		value: '/rss/the-thao.rss',
	},
	{
		label: 'Law',
		value: '/rss/phap-luat.rss',
	},
	{
		label: 'Education',
		value: '/rss/giao-duc.rss',
	},
	{
		label: 'Health',
		value: '/rss/suc-khoe.rss',
	},
	{
		label: 'Life',
		value: '/rss/gia-dinh.rss',
	},
	{
		label: 'Travel',
		value: '/rss/du-lich.rss',
	},
	{
		label: 'Funny',
		value: '/rss/cuoi.rss',
	},
];

const SkeletonLoad = (
	<Fragment>
		<Stack spacing={1} my={2}>
			<Skeleton variant="text" />
			<Skeleton variant="text" width="70%" />
		</Stack>
		<Stack
			direction="row"
			px={4}
			sx={{ flexWrap: 'wrap', bgcolor: (theme) => theme.palette.background.paper, borderRadius: '5px' }}
		>
			{[...Array(4)].map((_, index) => (
				<Stack
					key={index}
					spacing={1}
					p={2}
					sx={(theme) => ({
						width: '50%',
						[theme.breakpoints.down('md')]: {
							width: '100%',
						},
					})}
				>
					<Skeleton variant="text" />
					<Skeleton variant="rectangular" height={200} />
					<Skeleton variant="text" />
					<Skeleton variant="text" width="70%" />
				</Stack>
			))}
		</Stack>
	</Fragment>
);

const initialState = NEWS_TABS.reduce((states, state) => {
	const { value } = state;
	return {
		...states,
		[value]: null,
	};
}, {});

const handlers = {
	FILL_TAB: (state, action) => {
		const { value, news } = action.payload;
		return {
			...state,
			[value]: news,
		};
	},
};

const reducer = (state, action) =>
	handlers[action.type] ? handlers[action.type](state, action) : state;

const News = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [currentTab, setCurrentTab] = useState(NEWS_TABS[0].value);
	const visitedTabs = useRef([]); // store tabs are visited to prevent fetch redundant data
	useEffect(() => {
		// only fetch new data when first time visited tab
		const isVisitedTab = visitedTabs.current.includes(currentTab);
		if (!isVisitedTab) {
			visitedTabs.current = [...visitedTabs.current, currentTab];
			const getRssFeedData = async () => {
				const response = await axios.get(`${CORS_PROXY}https://vnexpress.net${currentTab}`);
				const parser = new DOMParser();
				const xml = parser.parseFromString(response.data, 'text/xml');
				const root = {
					title: xml.getElementsByTagName('image')[0].getElementsByTagName('title')[0].childNodes[0]
						.nodeValue,
					image: xml.getElementsByTagName('image')[0].getElementsByTagName('url')[0].childNodes[0].nodeValue,
					link: xml.getElementsByTagName('image')[0].getElementsByTagName('link')[0].childNodes[0].nodeValue,
					pubDate: xml.getElementsByTagName('pubDate')[0].childNodes[0].nodeValue,
				};
				const items = [];
				for (let item of xml.getElementsByTagName('item')) {
					const title = item.getElementsByTagName('title')[0].childNodes[0].nodeValue;
					const description = item.getElementsByTagName('description')[0].childNodes[0].nodeValue;
					const pubDate = item.getElementsByTagName('pubDate')[0].childNodes[0].nodeValue;
					items.push({
						title,
						description,
						pubDate,
					});
				}
				const news = {
					root,
					items,
				};
				dispatch({
					type: 'FILL_TAB',
					payload: {
						value: currentTab,
						news,
					},
				});
			};
			getRssFeedData();
		}
	}, [currentTab]);

	const handleChangeTab = (e, newValue) => {
		setCurrentTab(newValue);
	};
	return (
		<Page title="News | Tipe">
			<Container>
				<Teleport />
				<Breadcrumbs header="News" links={[]} />
				{NEWS_TABS.map((tab) => {
					const { value } = tab;
					const isActive = value === currentTab;
					return (
						isActive && (
							<Fragment key={value}>
								{state[value] && (
									<Fragment>
										<Link component="a" href={state[value].root.link} target="_blank" color="inherit" underline="none">
											<Stack direction="row" alignItems="center" spacing={2} my={2}>
												<ImageLoader alt={state[value].root.title} src={state[value].root.image} />
												<Stack>
													<Typography variant="h4">{state[value].root.title}</Typography>
													<Typography variant="caption">{state[value].root.pubDate}</Typography>
												</Stack>
											</Stack>
										</Link>
										<Tabs
											value={currentTab}
											variant="scrollable"
											scrollButtons="auto"
											onChange={handleChangeTab}
											sx={{
												overflow: 'inherit',
												position: 'sticky',
												top: `calc(${HEADER_HEIGHT} + 6px)`,
												bgcolor: (theme) => theme.palette.background.paper,
												'&:before, &:after': {
													content: '""',
													position: 'absolute',
													width: '100%',
													height: '6px',
													bgcolor: (theme) => theme.palette.background.default,
												},
												'&:before': {
													top: '-6px',
												},
												'&:after': {
													bottom: '-6px',
												},
											}}
										>
											{NEWS_TABS.map((tab) => {
												const { value, label } = tab;
												return <Tab key={value} label={label} value={value} />;
											})}
										</Tabs>
										<Stack
											direction="row"
											px={4}
											sx={{ flexWrap: 'wrap', bgcolor: (theme) => theme.palette.background.paper, borderRadius: '5px' }}
										>
											{state[value].items.map((item, index) => {
												const { title, description, pubDate } = item;
												return (
													<Stack
														key={index}
														spacing={1}
														p={2}
														sx={(theme) => ({
															width: '50%',
															[theme.breakpoints.down('md')]: {
																width: '100%',
															},
														})}
													>
														<Stack>
															<Tooltip placement="top" title={title} arrow>
																<Typography
																	variant="h6"
																	noWrap
																	sx={{ fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden' }}
																>
																	{title}
																</Typography>
															</Tooltip>

															<Typography variant="caption" sx={{ alignSelf: 'end' }}>
																{pubDate}
															</Typography>
														</Stack>
														<Typography
															dangerouslySetInnerHTML={{ __html: description }}
															sx={{
																'& a img': {
																	width: '100%',
																	borderRadius: '5px',
																},
															}}
														/>
													</Stack>
												);
											})}
										</Stack>
									</Fragment>
								)}
								{!state[value] && SkeletonLoad}
							</Fragment>
						)
					);
				})}
			</Container>
		</Page>
	);
};

export default News;
