import { styled } from '@mui/material/styles';
import {
	Stack,
	Divider,
	Typography,
	TextField,
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
	Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
	PermPhoneMsgOutlined,
	MailOutline,
	SyncLockOutlined,
	FacebookOutlined,
	AttachEmail,
} from '@mui/icons-material';

// components
import Page from '../../components/Page';
import { UploadSingleFile } from '../../components/_external_/dropzone';
import { DateOfBirth } from '../../components/customer';

const Profile = () => {
	return (
		<Page title="Account information | Tipe">
			<RootStyle direction="row">
				<Stack spacing={2} p={2} sx={{ width: '575px' }}>
					<Typography variant="subtitle2">Personal information</Typography>
					<Stack direction="row" spacing={3}>
						<Stack>
							<UploadSingleFile
								allowed={{
									'image/*': ['.jpeg', '.jpg', '.png'],
								}}
								maxSize={1048576}
								file="_external_/avatar/avatar.png"
								error={false}
								onDrop={() => {}}
								caption={
									<Typography
										variant="caption"
										sx={{
											my: 2,
											mx: 'auto',
											display: 'block',
											textAlign: 'center',
											color: 'text.secondary',
										}}
									>
										Allowed *.jpeg, *.jpg, *.png
										<br />
										Maximum size of 1MB
									</Typography>
								}
								sx={{
									width: '130px',
									height: '130px',
									borderRadius: '50%',
									'& > div': {
										borderRadius: '50%',
									},
								}}
							/>
						</Stack>
						<Stack spacing={2} sx={{ flex: 1 }}>
							<Stack direction="row" alignItems="center" spacing={3}>
								<Typography variant="subtitle2" sx={{ width: '70px' }}>
									Customer name
								</Typography>
								<TextField label="Enter your name" variant="outlined" size="small" />
							</Stack>
							<Stack direction="row" alignItems="center" spacing={3}>
								<Typography variant="subtitle2" sx={{ width: '70px' }}>
									Date of birth
								</Typography>
								<DateOfBirth />
							</Stack>
							<Stack direction="row" alignItems="center" spacing={3}>
								<Typography variant="subtitle2" sx={{ width: '70px' }}>
									Gender
								</Typography>
								<FormControl>
									<RadioGroup row>
										<FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
										<FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
										<FormControlLabel value="other" control={<Radio size="small" />} label="Other" />
									</RadioGroup>
								</FormControl>
							</Stack>
							<LoadingButton loading={false} variant="contained" color="error" disableElevation>
								SAVE CHANGE
							</LoadingButton>
						</Stack>
					</Stack>
				</Stack>
				<Divider orientation="vertical" />
				<Stack p={2} spacing={2} sx={{ flex: 1 }}>
					<Stack spacing={2}>
						<Typography variant="subtitle2">Phone number and Email</Typography>
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Stack direction="row" alignItems="center" spacing={1}>
								<PermPhoneMsgOutlined />
								<div>
									<Typography variant="body2">Phone number</Typography>
									<Typography variant="caption">0586181641</Typography>
								</div>
							</Stack>
							<Button variant="outlined" color="error" size="small">
								UPDATE
							</Button>
						</Stack>
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Stack direction="row" alignItems="center" spacing={1}>
								<MailOutline />
								<div>
									<Typography variant="body2">Email</Typography>
									<Typography variant="caption">Add email address</Typography>
								</div>
							</Stack>
							<Button variant="outlined" color="error" size="small">
								UPDATE
							</Button>
						</Stack>
					</Stack>
					<Stack spacing={2}>
						<Typography variant="subtitle2">Security</Typography>
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Stack direction="row" alignItems="center" spacing={1}>
								<SyncLockOutlined />
								<Typography component="span" variant="body2">
									Change password
								</Typography>
							</Stack>
							<Button variant="outlined" color="error" size="small">
								UPDATE
							</Button>
						</Stack>
					</Stack>
					<Stack spacing={2}>
						<Typography variant="subtitle2">Social network link</Typography>
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Stack direction="row" alignItems="center" spacing={1}>
								<FacebookOutlined color="primary" />
								<Typography component="span" variant="body2">
									Facebook
								</Typography>
							</Stack>
							<Button variant="outlined" color="error" size="small">
								LINK
							</Button>
						</Stack>
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Stack direction="row" alignItems="center" spacing={1}>
								<AttachEmail color="error" />
								<Typography component="span" variant="body2">
									Google
								</Typography>
							</Stack>
							<Button variant="outlined" color="error" size="small">
								LINK
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</RootStyle>
		</Page>
	);
};

const RootStyle = styled(Stack)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	borderRadius: '8px',
}));

export default Profile;
