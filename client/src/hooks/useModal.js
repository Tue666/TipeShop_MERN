import { useDispatch } from 'react-redux';

// components
import { keys } from '../components/Modal';
// redux
import { renderModal } from '../redux/slices/modal';

const useModal = () => {
	const dispatch = useDispatch();
	const openModal = (key = 'default', params = null) => {
		dispatch(
			renderModal({
				isOpen: true,
				key,
				params,
			})
		);
	};
	const closeModal = () => {
		dispatch(
			renderModal({
				isOpen: false,
				key: 'default',
				params: null,
			})
		);
	};
	return { openModal, closeModal, keys };
};

export default useModal;
