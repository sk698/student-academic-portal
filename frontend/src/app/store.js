import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'
import announcementsReducer from '../features/info/announcementsSlice'
import resultsReducer from '../features/info/resultsSlice'
import timetableReducer from '../features/info/timetableSlice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		dashboard: dashboardReducer,
		results: resultsReducer,
		announcements: announcementsReducer,
		timetable: timetableReducer,
	},
})
