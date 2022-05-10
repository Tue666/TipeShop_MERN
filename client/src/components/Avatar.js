import { string, object } from 'prop-types';
import { Avatar as MAvatar } from '@mui/material';

const propTypes = {
	src: string,
	sx: object,
};

const Avatar = ({ name, src, sx }) => {
	return <MAvatar alt={name} src={src} sx={{ width: 60, height: 60, ...sx }} />;
};

Avatar.propTypes = propTypes;

export default Avatar;
