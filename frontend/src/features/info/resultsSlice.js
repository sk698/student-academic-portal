import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getResults } from '../../services/api'

export const fetchResults = createAsyncThunk('results/fetchResults', async (_, { rejectWithValue }) => {
	try {
		const response = await getResults()
		return response.data
	} catch (error) {
		return rejectWithValue(error.message)
	}
})

const resultsSlice = createSlice({
	name: 'results',
	initialState: {
		data: null,
		status: 'idle',
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchResults.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(fetchResults.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.data = action.payload
			})
			.addCase(fetchResults.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload ?? 'Failed to fetch results'
			})
	},
})

export default resultsSlice.reducer
