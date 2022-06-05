import { shape, string, func } from 'prop-types';
import { styled } from '@mui/material/styles';
import { Stack, Typography, Button } from '@mui/material';

const propTypes = {
	address: shape({
		name: string,
		region: shape({
			_id: string,
			name: string,
		}),
		district: shape({
			_id: string,
			name: string,
		}),
		ward: shape({
			_id: string,
			name: string,
		}),
		street: string,
		phone_number: string,
	}),
	handleSwitch: func,
	handleNavigate: func,
	handleRemove: func,
};

const DeliveryAddress = ({ address, handleSwitch, handleNavigate, handleRemove }) => {
	const { _id, name, street, ward, district, region, phone_number, is_default } = address;
	const delivery_address = `${street}, ${ward.name}, ${district.name}, ${region.name}`;
	return (
		<Address is_default={is_default ? 1 : 0}>
			<Stack sx={{ width: '100%' }}>
				<div>
					<Typography component="span" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
						{name}
					</Typography>
				</div>
				<div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
					<Typography component="span" variant="caption">
						Address:&nbsp;
					</Typography>
					<Typography component="span" variant="subtitle2">
						{delivery_address}
					</Typography>
				</div>
				<div>
					<Typography component="span" variant="caption">
						Phone number:&nbsp;
					</Typography>
					<Typography component="span" variant="subtitle2">
						{phone_number}
					</Typography>
				</div>
				<Stack direction="row" alignItems="center" spacing={1} mt={1}>
					<Button variant="contained" size="small" disableElevation onClick={() => handleSwitch(_id)}>
						Delivery to this address
					</Button>
					<Button
						variant="outlined"
						color="success"
						size="small"
						disableElevation
						onClick={() => handleNavigate(_id)}
					>
						Edit
					</Button>
					{!is_default && (
						<Button
							variant="outlined"
							color="error"
							size="small"
							disableElevation
							onClick={() => handleRemove(_id)}
						>
							Remove
						</Button>
					)}
				</Stack>
			</Stack>
			{is_default && (
				<Default component="span" variant="caption" color="success.main">
					<i className="bi bi-check-circle"></i> Default address
				</Default>
			)}
		</Address>
	);
};

const Address = styled('div')(({ theme, is_default }) => ({
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(2),
	borderRadius: '5px',
	display: 'flex',
	justifyContent: 'space-between',
	border: is_default ? `1px dashed ${theme.palette.success.main}` : `1px solid rgb(221, 221, 221)`,
	position: 'relative',
}));

const Default = styled(Typography)({
	position: 'absolute',
	top: '10px',
	right: '15px',
	fontWeight: 'bold',
});

DeliveryAddress.propTypes = propTypes;

export default DeliveryAddress;
