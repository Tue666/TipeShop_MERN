import { oneOfType, string, bool, node, object } from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import { Stack, Box, Typography, Paper } from '@mui/material';
import { AddAPhoto } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

// utils
import { distinguishImage } from '../../../utils/formatImage';

const propTypes = {
	file: oneOfType([string, object]),
	error: bool,
	caption: node,
	sx: object,
};

const UploadSingleFile = ({ allowed, file, error, caption, sx, ...other }) => {
	const { getRootProps, getInputProps, fileRejections, isDragActive, isDragReject } = useDropzone({
		multiple: false,
		accept: {
			...allowed,
		},
		...other,
	});

	const ShowRejectionItems = () => (
		<Paper
			variant="outlined"
			sx={{
				px: 1,
				borderColor: 'error.light',
				bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
			}}
		>
			{fileRejections.map(({ file, errors }) => {
				const { path, size } = file;
				return (
					<Box key={path} sx={{ my: 1 }}>
						<Typography variant="subtitle2" noWrap>
							{path} - {size}
						</Typography>
						{errors.map((e) => (
							<Typography key={e.code} variant="caption" component="p">
								- {e.message}
							</Typography>
						))}
					</Box>
				);
			})}
		</Paper>
	);
	return (
		<Stack alignItems="center">
			<RootStyle
				sx={{
					...(isDragActive && { opacity: 0.72 }),
					...((isDragReject || error) && {
						borderColor: 'error.main',
					}),
					...sx,
				}}
			>
				<DropZoneStyle {...getRootProps()}>
					<input {...getInputProps()} />
					{file && (
						<Box
							component="img"
							alt="image"
							src={typeof file === 'string' ? distinguishImage(file) : file.preview}
							sx={{ zIndex: 8, objectFit: 'cover' }}
						/>
					)}
					<PlaceholderStyle>
						<AddAPhoto />
						<Typography variant="caption">{file ? 'Update image' : 'Upload Image'}</Typography>
					</PlaceholderStyle>
				</DropZoneStyle>
			</RootStyle>
			{caption}
			{fileRejections.length > 0 && <ShowRejectionItems />}
		</Stack>
	);
};

const RootStyle = styled('div')(({ theme }) => ({
	width: '100%',
	height: '200px',
	padding: theme.spacing(1),
	margin: theme.spacing(1),
	border: '1px dashed rgba(145, 158, 171, 0.32)',
}));

const DropZoneStyle = styled('div')({
	zIndex: 0,
	width: '100%',
	height: '100%',
	outline: 'none',
	display: 'flex',
	overflow: 'hidden',
	position: 'relative',
	alignItems: 'center',
	justifyContent: 'center',
	'& > *': { width: '100%', height: '100%' },
	'&:hover': {
		cursor: 'pointer',
		'& .placeholder': {
			zIndex: 9,
		},
	},
});

const PlaceholderStyle = styled('div')({
	display: 'flex',
	position: 'absolute',
	alignItems: 'center',
	flexDirection: 'column',
	justifyContent: 'center',
	color: 'rgb(99, 115, 129)',
	backgroundColor: 'rgb(244, 246, 248)',
	'&:hover': { opacity: 0.72 },
});

UploadSingleFile.propTypes = propTypes;

export default UploadSingleFile;
