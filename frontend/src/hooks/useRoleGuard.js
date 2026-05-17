import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/useUserStore'

export function useRoleGuard(allowedRoles) {
  const navigate = useNavigate()
  const currentUser = useUserStore((s) => s.currentUser)

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      navigate('/')
    }
  }, [currentUser, allowedRoles, navigate])

  return currentUser
}
