import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const UserLogout = () => {
    const token=localStorage.getItem('userToken');
    const navigate=useNavigate();
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: true
        }).catch((error) => {
            console.error('Logout API error:', error.response?.data || error.message);
        }).finally(() => {
            localStorage.removeItem('userToken');
            navigate('/login', { replace: true });
        });
    }, [navigate, token]);
  return (
    <div>UserLogout</div>
  )
}

export default UserLogout