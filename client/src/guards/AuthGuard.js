import { node } from 'prop-types';

// hooks
import useAuth from '../hooks/useAuth';
import useModal from '../hooks/useModal';

const propTypes = {
	children: node,
};

const AuthGuard = ({ children }) => {
	const { isAuthenticated } = useAuth();
	const { openModal, keys } = useModal();
	!isAuthenticated && openModal(keys.authentication, null, false);
	return <>{children}</>;
};

AuthGuard.propTypes = propTypes;

export default AuthGuard;
