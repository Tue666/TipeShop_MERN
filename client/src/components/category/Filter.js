import { oneOfType, shape, array, arrayOf, number, string, bool, func, object } from 'prop-types';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Stack, Chip, Checkbox } from '@mui/material';

// components
import Stars from '../Stars';
import Collapse from '../Collapse';
// constant
import { CATEGORY_PAGE } from '../../constant';
//
import ApplyPrice from './ApplyPrice';

const propTypes = {
	queryParams: object,
	filtered: shape({
		sub: oneOfType([
			array,
			arrayOf(
				shape({
					_id: number,
					name: string,
					slug: string,
				})
			),
		]),
		rating: shape({
			_id: string,
			query_name: string,
			display_name: string,
			collapsed: number,
			multi_select: bool,
			values: arrayOf(
				shape({
					_id: string,
					display_value: string,
					query_value: string,
				})
			),
		}),
		price: shape({
			_id: string,
			query_name: string,
			display_name: string,
			collapsed: number,
			multi_select: bool,
			values: arrayOf(
				shape({
					_id: string,
					display_value: string,
					query_value: string,
				})
			),
		}),
		attributes: oneOfType([
			array,
			arrayOf(
				shape({
					_id: string,
					query_name: string,
					display_name: string,
					collapsed: number,
					multi_select: bool,
					values: arrayOf(
						shape({
							_id: string,
							display_value: string,
							query_value: string,
						})
					),
				})
			),
		]),
	}),
	handleNavigate: func,
};

const Filter = ({ queryParams, filtered, handleNavigate }) => {
	const { sub, rating, price, attributes } = filtered;
	const renderAttribute = (attributes, query_name, multi_select) =>
		attributes.map((attribute) => {
			const { _id, display_value, query_value, selected } = attribute;
			return (
				<Text key={_id} onClick={() => handleNavigate(query_name, query_value, multi_select, true)}>
					{multi_select && (
						<Checkbox checked={selected} size="small" color="error" sx={{ p: '5px', mr: '5px' }} />
					)}
					{display_value}
				</Text>
			);
		});
	return (
		<RootStyle>
			{sub && sub.length > 0 && (
				<Wrapper>
					<Title>Product portfolio</Title>
					{sub.map((category) => (
						<Link key={category._id} to={`/${category.slug}/cid${category._id}`}>
							<Text>{category.name}</Text>
						</Link>
					))}
				</Wrapper>
			)}
			{rating && (
				<Wrapper>
					<Title>{rating.display_name}</Title>
					<Stack>
						{rating.values.map((value) => {
							const { _id, query_value, display_value } = value;
							return (
								<Text
									key={_id}
									onClick={() => handleNavigate(rating.query_name, query_value, rating.multi_select, true)}
								>
									<Stars total={5} rating={parseInt(query_value)} />
									&nbsp;{display_value}
								</Text>
							);
						})}
					</Stack>
				</Wrapper>
			)}
			{price && (
				<Wrapper>
					<Title>{price.display_name}</Title>
					{price.values.map((value) => {
						const { _id, query_value, display_value } = value;
						return (
							<Chip
								key={_id}
								label={display_value}
								color="error"
								variant={queryParams[price.query_name] === query_value ? 'contained' : 'outlined'}
								sx={{ my: '2px' }}
								size="small"
								onClick={() => handleNavigate(price.query_name, query_value, price.multi_select, true)}
							/>
						);
					})}
					<ApplyPrice query_name={price.query_name} handleNavigate={handleNavigate} />
				</Wrapper>
			)}
			{attributes &&
				attributes.map((attribute) => {
					const { _id, display_name, query_name, collapsed, multi_select, values } = attribute;
					const sortedValues = multi_select
						? values
								.map((value) => ({
									...value,
									selected: queryParams[query_name]?.indexOf(value.query_value.toString()) > -1,
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
	borderBottom: `2px solid ${theme.palette.background.default}`,
}));

const Title = styled('span')({
	fontWeight: 'bold',
	fontSize: '13px',
	display: 'block',
	paddingBottom: '10px',
	textTransform: 'uppercase',
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
