import { useOutletContext } from 'react-router-dom';
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

const SOCIAL = [
	{
		type: 'facebook',
		label: 'Facebook',
		icon: <FacebookOutlined color="primary" />,
	},
	{
		type: 'google',
		label: 'Google',
		icon: <AttachEmail color="error" />,
	},
];

const Profile = () => {
	const { profile } = useOutletContext();
	const { phone_number, is_phone_verified, email, is_email_verified, social } = profile;

	const handleLinkSocial = (social) => {
		console.log(social);
	};
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
									<Typography variant="body2" sx={{ display: 'flex', alignItems: 'start' }}>
										Phone number &nbsp;
										{is_phone_verified && (
											<Typography component="span" variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
												Verified <i className="bi bi-check-circle" />
											</Typography>
										)}
									</Typography>
									{phone_number && (
										<Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
											{phone_number}
										</Typography>
									)}
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
									<Typography variant="body2" sx={{ display: 'flex', alignItems: 'start' }}>
										Email &nbsp;
										{is_email_verified && (
											<Typography component="span" variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
												Verified <i className="bi bi-check-circle" />
											</Typography>
										)}
									</Typography>
									{email && (
										<Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
											{email}
										</Typography>
									)}
									{!email && <Typography variant="caption">Add email address</Typography>}
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
						{SOCIAL.map((item) => {
							const { type, label, icon } = item;
							const isLinked = Boolean(social.find((s) => s.type === type)?.id);
							return (
								<Stack key={type} direction="row" justifyContent="space-between" alignItems="center">
									<Stack direction="row" alignItems="center" spacing={1}>
										{icon}
										<Typography component="span" variant="body2">
											{label}
										</Typography>
									</Stack>
									<Button
										variant="outlined"
										color="error"
										size="small"
										disabled={isLinked}
										onClick={() => !isLinked && handleLinkSocial(type)}
									>
										{isLinked ? 'LINKED' : 'LINK'}
									</Button>
								</Stack>
							);
						})}
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
