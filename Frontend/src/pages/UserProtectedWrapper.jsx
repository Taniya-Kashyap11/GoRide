import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
const UserProtectedWrapper = ({children}) => {
    const token=localStorage.getItem('userToken');
    const navigate=useNavigate();
    const { setUser } = useContext(UserDataContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }).then((response) => {
        setUser(response.data.user);
        setIsLoading(false);
      }).catch(() => {
        localStorage.removeItem('userToken');
        navigate('/login', { replace: true });
      });
    }, [token, navigate, setUser]);

    if (isLoading) return <div>Loading...</div>;
    return <>{children}</>;
}

export default UserProtectedWrapper