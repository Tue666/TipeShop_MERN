import { Container, Typography } from '@mui/material';

const Footer = () => {
	return (
		<Container>
			<div>
				<Typography variant="caption" component="p">
					By placing a Purchase Order, the customer agrees to the General Trading Conditions issued by Tipe
					Shop
				</Typography>
				<Typography variant="caption" component="p">
					© {new Date().getFullYear()} - Copyright Tipe Company - Tipe.vn
				</Typography>
			</div>
		</Container>
	);
};

export default Footer;
