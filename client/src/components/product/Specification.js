import { string, oneOfType, array, arrayOf, shape } from 'prop-types';
import { styled } from '@mui/material/styles';

const propTypes = {
	specifications: oneOfType([
		array,
		arrayOf(
			shape({
				name: string,
				value: string,
			})
		),
	]),
};

const Specification = ({ specifications }) => {
	return (
		<Table>
			<tbody>
				{specifications.map((specification, index) => {
					const { name, value } = specification;
					return (
						<tr key={index}>
							<td className="title">{name}</td>
							<td>{value}</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};

const Table = styled('table')(({ theme }) => ({
	width: '100%',
	fontSize: '14px',
	'& td.title': {
		width: '35%',
		backgroundColor: theme.palette.background.default,
		fontWeight: 'bold',
		borderRight: 'none',
	},
	'& td': {
		padding: '15px',
	},
}));

Specification.propTypes = propTypes;

export default Specification;
