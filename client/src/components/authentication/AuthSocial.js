import { Stack, Box, Divider, Typography, Link } from '@mui/material';

const AuthSocial = () => {
	return (
		<Stack spacing={2} alignItems="center">
			<Divider sx={{ width: '100%' }}>Or continue by</Divider>
			<Stack direction="row" spacing={2}>
				<Link href="https://www.facebook.com/exe.shiro" target="_blank">
					<Box
						component="img"
						src="https://salt.tikicdn.com/ts/upload/3a/22/45/0f04dc6e4ed55fa62dcb305fd337db6c.png"
						alt="facebook"
						sx={{ width: '58px' }}
					/>
				</Link>
				<Link href="https://www.facebook.com/exe.shiro" target="_blank">
					<Box
						component="img"
						src="https://salt.tikicdn.com/ts/upload/1c/ac/e8/141c68302262747f5988df2aae7eb161.png"
						alt="gmail"
						sx={{ width: '58px' }}
					/>
				</Link>
			</Stack>
			<Typography variant="caption">
				By continuing, you accept the &nbsp;
				<Link href="https://www.facebook.com/exe.shiro" target="_blank">
					terms of use
				</Link>
			</Typography>
		</Stack>
	);
};

export default AuthSocial;
