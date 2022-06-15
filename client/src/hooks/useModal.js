import { useDispatch } from 'react-redux';

// components
import { keys } from '../components/Modal';
// redux
import { renderModal, disappearModal } from '../redux/slices/modal';

const useModal = () => {
	const dispatch = useDispatch();
	const openModal = (key = 'default', params = null, beClosed = true) => {
		const objectsModal = {
			beClosed,
			...(params && params),
		};
		dispatch(
			renderModal({
				isOpen: true,
				key,
				params: objectsModal,
			})
		);
	};
	const closeModal = () => {
		dispatch(disappearModal());
	};
	return { openModal, closeModal, keys };
};

export default useModal;
