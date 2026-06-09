import axios from 'axios'
import { create } from 'zustand'

interface UserState {
  user: {
    _id: string
    username: string
    email: string
    sex: string
    age: number
    degree: string
  } | null
  token: string | null
  isLogin: boolean
  login: (email: string, password: string) => Promise<void>
  loginOut: () => void
  register: (email: string, password: string) => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLogin: !!localStorage.getItem('token'),

  login: async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/users/login', {
      email,
      password
    })
    const { token, user } = res.data
    localStorage.setItem('token', token)
    set({ user, token, isLogin: true })
  },
  loginOut: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isLogin: false })
  },
  register: async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/users/register', {
      email,
      password
    })
    const { user } = res.data
    set({ user })
  }
}))

export default useUserStore