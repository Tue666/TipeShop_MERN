import { useDispatch } from 'react-redux';

// components
import { keys } from '../components/Modal';
// redux
import { renderModal } from '../redux/slices/modal';

const useModal = () => {
	const dispatch = useDispatch();
	const openModal = (key = 'default') => {
		dispatch(
			renderModal({
				isOpen: true,
				key,
			})
		);
	};
	const closeModal = () => {
		dispatch(
			renderModal({
				isOpen: false,
				key: 'default',
			})
		);
	};
	return { openModal, closeModal, keys };
};

export default useModal;
