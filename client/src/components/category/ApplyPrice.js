import { string, func } from 'prop-types';
import { Fragment, useState } from 'react';
import { Stack, TextField, Button } from '@mui/material';
import { ReadMore } from '@mui/icons-material';

const propTypes = {
	query_name: string,
	handleNavigate: func,
};

const ApplyPrice = ({ query_name, handleNavigate }) => {
	const [from, setFrom] = useState('0');
	const [to, setTo] = useState('0');

	const handleChangeFrom = (e) => {
		let value = e.target.value.replace(/^0+/, '');
		if (from !== '0' && value === '') value = '0';
		if (!/^\d+$/.test(value)) return;
		setFrom(value);
	};
	const handleChangeTo = (e) => {
		let value = e.target.value.replace(/^0+/, '');
		if (to !== '0' && value === '') value = '0';
		if (!/^\d+$/.test(value)) return;
		setTo(value);
	};
	return (
		<Fragment>
			<Stack direction="row" spacing={2} my={2}>
				<TextField value={from} label="From" variant="standard" color="error" onChange={handleChangeFrom} />
				<TextField value={to} label="To" variant="standard" color="error" onChange={handleChangeTo} />
			</Stack>
			<Button
				color="error"
				variant="contained"
				startIcon={<ReadMore />}
				disableElevation
				onClick={() => handleNavigate(query_name, `${from},${to}`, false, true)}
			>
				Apply
			</Button>
		</Fragment>
	);
};

ApplyPrice.propTypes = propTypes;

export default ApplyPrice;
