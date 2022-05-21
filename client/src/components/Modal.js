import { forwardRef } from 'react';
import { Dialog, Slide } from '@mui/material';
import { useSelector } from 'react-redux';

// components
import { Authentication } from '../components/authentication';
// hooks
import useModal from '../hooks/useModal';

const components = {
	default: null,
	authentication: <Authentication />,
};

export const keys = Object.keys(components).reduce((keys, key) => ({ ...keys, [key]: key }), {});

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = () => {
	const { isOpen, key } = useSelector((state) => state.modal);
	const { closeModal } = useModal();
	return (
		<Dialog open={isOpen} onClose={closeModal} TransitionComponent={Transition} maxWidth={false}>
			{components[key]}
		</Dialog>
	);
};

export default Modal;
