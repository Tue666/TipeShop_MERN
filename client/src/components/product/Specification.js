import { styled } from '@mui/material/styles';

const Specification = () => {
	return (
		<Table>
			<tbody>
				<tr>
					<td className="title">Bluetooth</td>
					<td>Bluetooth v5.0</td>
				</tr>
				<tr>
					<td className="title">Bluetooth</td>
					<td>Bluetooth v5.0</td>
				</tr>
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

export default Specification;
