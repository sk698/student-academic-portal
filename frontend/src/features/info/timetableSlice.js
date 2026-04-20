import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getTimetable } from '../../services/api'

export const fetchTimetable = createAsyncThunk('timetable/fetchTimetable', async (_, { rejectWithValue }) => {
	try {
		const response = await getTimetable()
		return response.data
	} catch (error) {
		return rejectWithValue(error.message)
	}
})

const timetableSlice = createSlice({
	name: 'timetable',
	initialState: {
		data: null,
		status: 'idle',
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTimetable.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(fetchTimetable.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.data = action.payload
			})
			.addCase(fetchTimetable.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload ?? 'Failed to fetch timetable'
			})
	},
})

export default timetableSlice.reducer
