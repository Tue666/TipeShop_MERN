import { oneOfType, shape, array, arrayOf, number, string, bool, func, object } from 'prop-types';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Stack, TextField, Button, Chip, Checkbox } from '@mui/material';
import { ReadMore } from '@mui/icons-material';

// components
import Stars from '../Stars';
import Collapse from '../Collapse';
// constant
import { CATEGORY_PAGE } from '../../constant';

const propTypes = {
	queryParams: object,
	filter: shape({
		children: oneOfType([
			array,
			arrayOf(
				shape({
					_id: number,
					name: string,
					slug: string,
				})
			),
		]),
		attributes: oneOfType([
			array,
			arrayOf(
				shape({
					_id: number,
					query_name: string,
					display_name: string,
					collapsed: number,
					multi_select: bool,
					values: arrayOf(
						shape({
							_id: number,
							display_value: string,
						})
					),
				})
			),
		]),
	}),
	handleNavigate: func,
};

const Filter = ({ queryParams, filter, handleNavigate }) => {
	const { children, attributes } = filter;
	const renderAttribute = (attributes, query_name, multi_select) =>
		attributes.map((attribute) => {
			const { _id, display_value, selected } = attribute;
			return (
				<Text key={_id} onClick={() => handleNavigate(query_name, _id, true)}>
					{multi_select && (
						<Checkbox checked={selected} size="small" color="error" sx={{ p: '5px', mr: '5px' }} />
					)}
					{display_value}
				</Text>
			);
		});
	return (
		<RootStyle>
			{children && children.length > 0 && (
				<Wrapper>
					<Title>Product portfolio</Title>
					{children.map((category) => (
						<Link key={category._id} to={`/${category.slug}/cid${category._id}`}>
							<Text>{category.name}</Text>
						</Link>
					))}
				</Wrapper>
			)}
			<Wrapper>
				<Title>Rating</Title>
				<Stack>
					{[5, 4, 3].map((value) => (
						<Text key={value} onClick={() => handleNavigate('rating', value)}>
							<Stars total={5} rating={value} />
							&nbsp;{value} stars
						</Text>
					))}
				</Stack>
			</Wrapper>
			<Wrapper>
				<Title>Price</Title>
				{['Less than 400.000', 'From 400.000 to 3.400.000', 'More than 3.400.000'].map((value) => (
					<Chip key={value} label={value} color="error" variant="outlined" sx={{ my: '2px' }} size="small" />
				))}
				<Stack direction="row" spacing={2} my={2}>
					<TextField value={0} label="From" variant="standard" color="error" />
					<TextField value={1} label="To" variant="standard" color="error" />
				</Stack>
				<Button color="error" variant="contained" startIcon={<ReadMore />}>
					Apply
				</Button>
			</Wrapper>
			{attributes &&
				attributes.map((attribute) => {
					const { _id, display_name, query_name, collapsed, multi_select, values } = attribute;
					const sortedValues = multi_select
						? values
								.map((value) => ({
									...value,
									selected: queryParams[query_name]?.indexOf(value._id.toString()) > -1,
								}))
								.sort((a, b) => b.selected - a.selected)
						: values;

					// splice will affected original array, the sortedValues array will return array of collapse items
					const showing = sortedValues?.splice(0, collapsed) || [];
					return (
						showing.length > 0 && (
							<Wrapper key={_id}>
								<Title>{display_name}</Title>
								<Stack>
									{renderAttribute(showing, query_name, multi_select)}
									{sortedValues.length > 0 && (
										<Collapse>{renderAttribute(sortedValues, query_name, multi_select)}</Collapse>
									)}
								</Stack>
							</Wrapper>
						)
					);
				})}
		</RootStyle>
	);
};

const RootStyle = styled(Stack)(({ theme }) => ({
	width: CATEGORY_PAGE.FILTER_WIDTH,
	borderRight: `2px solid ${theme.palette.background.default}`,
	[theme.breakpoints.down('sm')]: {
		width: '100%',
		marginBottom: '10px',
	},
}));

const Wrapper = styled('div')(({ theme }) => ({
	padding: '10px',
	backgroundColor: theme.palette.background.paper,
	fontSize: '14px',
	borderBottom: `2px solid ${theme.palette.background.default}`,
}));

const Title = styled('span')({
	fontWeight: 'bold',
	fontSize: '15px',
	display: 'block',
	paddingBottom: '10px',
});

const Text = styled('span')(({ theme }) => ({
	fontSize: '14px',
	display: 'flex',
	alignItems: 'center',
	paddingBottom: '5px',
	cursor: 'pointer',
	'&:hover': {
		color: theme.palette.error.main,
	},
}));

Filter.propTypes = propTypes;

export default Filter;
