import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getDashboard } from '../../services/api'

export const fetchDashboard = createAsyncThunk('dashboard/fetchDashboard', async (_, { rejectWithValue }) => {
	try {
		const response = await getDashboard()
		return response.data
	} catch (error) {
		return rejectWithValue(error.message)
	}
})

const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState: {
		data: null,
		status: 'idle',
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchDashboard.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(fetchDashboard.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.data = action.payload
			})
			.addCase(fetchDashboard.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload ?? 'Failed to fetch dashboard'
			})
	},
})

export default dashboardSlice.reducer
