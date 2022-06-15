import { shape, string } from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Typography, TextField, Button } from '@mui/material';

// apis
import orderApi from '../../apis/orderApi';
// hooks
import useModal from '../../hooks/useModal';
// utils
import enqueueSnackbar from '../../utils/snackbar';

const propTypes = {
	params: shape({
		_id: string,
	}),
};

const CancelOrder = ({ params }) => {
	const { _id } = params;
	const [note, setNote] = useState('');
	const navigate = useNavigate();
	const { closeModal } = useModal();

	const handleChangeNote = (e) => {
		const value = e.target.value;
		setNote(value);
	};
	const handleConfirm = async () => {
		try {
			await orderApi.editStatus({
				_id,
				note,
				new_status: 'canceled',
			});
			enqueueSnackbar('Order has been canceled', {
				variant: 'success',
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'right',
				},
			});
			navigate(0);
		} catch (error) {
			enqueueSnackbar(error.response.statusText, {
				variant: 'error',
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'right',
				},
			});
		}
	};
	return (
		<Stack p={3} spacing={1} sx={{ width: '450px' }}>
			<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
				Your feedback is very important to us! <br /> Can you tell us the reason for canceling the order?
			</Typography>
			<TextField
				fullWidth
				multiline
				rows={4}
				label="Write something here..."
				defaultValue={note}
				onBlur={handleChangeNote}
			/>
			<Stack direction="row" alignItems="center" spacing={2}>
				<Button fullWidth variant="contained" color="error" disableElevation onClick={handleConfirm}>
					CONFIRM
				</Button>
				<Button fullWidth variant="outlined" onClick={closeModal}>
					CLOSE
				</Button>
			</Stack>
		</Stack>
	);
};

CancelOrder.propTypes = propTypes;

export default CancelOrder;
