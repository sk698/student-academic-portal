import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAnnouncements } from '../../services/api'

export const fetchAnnouncements = createAsyncThunk('announcements/fetchAnnouncements', async (_, { rejectWithValue }) => {
	try {
		const response = await getAnnouncements()
		return response.data
	} catch (error) {
		return rejectWithValue(error.message)
	}
})

const announcementsSlice = createSlice({
	name: 'announcements',
	initialState: {
		data: null,
		status: 'idle',
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAnnouncements.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(fetchAnnouncements.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.data = action.payload
			})
			.addCase(fetchAnnouncements.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload ?? 'Failed to fetch announcements'
			})
	},
})

export default announcementsSlice.reducer
