import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login, register } from '../../services/api'

const savedToken = localStorage.getItem('token')
const savedUser = localStorage.getItem('user')

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
	try {
		const response = await login(credentials)
		return response.data
	} catch (error) {
		return rejectWithValue(error.message)
	}
})

export const registerUser = createAsyncThunk('auth/registerUser', async (payload, { rejectWithValue }) => {
	try {
		const response = await register(payload)
		return response.data
	} catch (error) {
		return rejectWithValue(error.message)
	}
})

const initialState = {
	token: savedToken ?? null,
	user: savedUser ? JSON.parse(savedUser) : null,
	status: 'idle',
	error: null,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout(state) {
			state.token = null
			state.user = null
			localStorage.removeItem('token')
			localStorage.removeItem('user')
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.token = action.payload.token
				state.user = {
					username: action.payload.username,
					role: action.payload.role,
				}
				localStorage.setItem('token', action.payload.token)
				localStorage.setItem('user', JSON.stringify(state.user))
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload ?? 'Login failed'
			})
			.addCase(registerUser.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(registerUser.fulfilled, (state) => {
				state.status = 'succeeded'
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload ?? 'Registration failed'
			})
	},
})

export const { logout } = authSlice.actions
export default authSlice.reducer
