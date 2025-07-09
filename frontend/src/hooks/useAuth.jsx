import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/slices/authSlice'

const useAuth = () => {
  const { user, token, isLoading } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    logout: handleLogout
  }
}

export default useAuth