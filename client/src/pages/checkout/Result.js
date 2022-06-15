import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Stack, Typography, Button } from '@mui/material';

// components
import ImageLoader from '../../components/ImageLoader';
// routes
import { PATH_MAIN, PATH_CUSTOMER } from '../../routes/path';
// config
import { apiConfig } from '../../config';

const Result = () => {
	const { state } = useLocation();
	const navigate = useNavigate();
	useEffect(() => {
		!state && navigate(PATH_MAIN.home);
	});
	return (
		<Container>
			<Stack
				alignItems="center"
				spacing={2}
				my={5}
				p={5}
				sx={{ bgcolor: (theme) => theme.palette.background.paper }}
			>
				<ImageLoader
					src={`${apiConfig.image_url}/_external_/buy_more.png`}
					alt="buy_more"
					sx={{ width: '190px', height: '160px' }}
				/>
				<Typography variant="body1" sx={{ fontWeight: 'bold' }}>
					{state?.msg}
				</Typography>
				<Stack direction="row" alignItems="center" spacing={3}>
					{state?.statusCode === 200 && (
						<Link to={PATH_CUSTOMER.orders}>
							<Button color="success" variant="contained" size="small" disableElevation>
								REVIEW ORDERED
							</Button>
						</Link>
					)}
					{state?.statusCode !== 200 && (
						<a href="https://www.facebook.com/exe.shiro">
							<Button color="error" variant="contained" size="small" disableElevation>
								REPORT
							</Button>
						</a>
					)}
					<Link to={PATH_MAIN.home}>
						<Button color="warning" variant="contained" size="small" disableElevation>
							BUY MORE
						</Button>
					</Link>
				</Stack>
			</Stack>
		</Container>
	);
};

export default Result;
