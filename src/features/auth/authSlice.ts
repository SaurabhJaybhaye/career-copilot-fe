import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UserPreferences {
  theme: 'light' | 'dark'
  notificationsEnabled: boolean
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

const getInitialState = (): AuthState => {
  const token = localStorage.getItem('token')
  let user: User | null = null
  try {
    const cachedUser = localStorage.getItem('user')
    if (cachedUser) {
      user = JSON.parse(cachedUser)
    }
  } catch (e) {
    console.error('Error parsing cached user', e)
  }

  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading: false,
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken?: string }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.token = accessToken
      state.isAuthenticated = true
      localStorage.setItem('token', accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    updateUserPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.user) {
        state.user.preferences = {
          ...state.user.preferences,
          ...action.payload,
        }
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
  },
})

export const { setCredentials, clearCredentials, setLoading, updateUserPreferences } = authSlice.actions
export default authSlice.reducer
