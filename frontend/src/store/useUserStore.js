import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_USERS } from '@/mock/users'

export const useUserStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      allUsers: MOCK_USERS,

      login: (userId) => {
        const user = MOCK_USERS.find((u) => u.id === userId)
        set({ currentUser: user })
      },

      logout: () => set({ currentUser: null }),

      isLoggedIn: () => !!get().currentUser,

      updateUserVerification: (userId, verified) =>
        set((state) => ({
          allUsers: state.allUsers.map((u) =>
            u.id === userId ? { ...u, verified } : u
          ),
        })),
    }),
    { name: 'bidding-user' }
  )
)
