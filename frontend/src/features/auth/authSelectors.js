export const selectAuth = (state) => state.auth
export const selectAuthToken = (state) => state.auth.token
export const selectAuthUser = (state) => state.auth.user
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => state.auth.error
export const selectIsAuthenticated = (state) => Boolean(state.auth.token)
export const selectIsAdmin = (state) => state.auth.user?.role === 'ADMIN'
