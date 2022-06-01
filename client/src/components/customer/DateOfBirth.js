import { Stack, TextField, MenuItem } from '@mui/material';

// utils
import { arrayRange } from '../../utils/generate';

const month = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const year = arrayRange(new Date().getFullYear(), 1990, 1);

const DateOfBirth = () => {
	let day = 31;
	const selectedMonth = '6';
	const selectedYear = '2022';
	switch (selectedMonth) {
		case '2':
			const yearInt = parseInt(selectedYear);
			if (yearInt % 400 === 0 || (yearInt % 4 === 0 && yearInt % 100 !== 0)) day = 29;
			else day = 28;
			break;
		case '4':
		case '6':
		case '9':
		case '11':
			day = 30;
			break;
		default:
			break;
	}
	return (
		<Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
			<TextField fullWidth value="" select label="Day" size="small">
				<MenuItem value="">Day</MenuItem>
				{arrayRange(1, day, 1).map((item, index) => (
					<MenuItem key={index} value={(index + 1).toString()}>
						{item}
					</MenuItem>
				))}
			</TextField>
			<TextField fullWidth value="" select label="Month" size="small">
				<MenuItem value="">Month</MenuItem>
				{month.map((item, index) => (
					<MenuItem key={index} value={(index + 1).toString()}>
						{item}
					</MenuItem>
				))}
			</TextField>
			<TextField fullWidth value="" select label="Year" size="small">
				<MenuItem value="">Year</MenuItem>
				{year.map((item, index) => (
					<MenuItem key={index} value={(index + 1).toString()}>
						{item}
					</MenuItem>
				))}
			</TextField>
		</Stack>
	);
};

export default DateOfBirth;
