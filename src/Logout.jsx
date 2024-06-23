import { useContext } from 'react';
import AuthContext from './backend/AuthProvider.jsx';

const Logout = () => {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default Logout;
