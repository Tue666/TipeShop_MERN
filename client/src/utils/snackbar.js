import { useSnackbar } from 'notistack';

let snackbarRef;
export const SnackbarUtilsConfigurator = () => {
	snackbarRef = useSnackbar();
	return null;
};

const enqueueSnackbar = (msg, options) => {
	snackbarRef.enqueueSnackbar(msg, options);
};

export default enqueueSnackbar;
