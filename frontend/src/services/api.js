const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8080'

async function request(path, options = {}) {
	const token = localStorage.getItem('token')
	const headers = {
		'Content-Type': 'application/json',
		...(options.headers ?? {}),
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers,
	})

	const payload = await response.json().catch(() => ({}))
	if (!response.ok) {
		const message = payload?.message ?? payload?.error ?? 'Request failed'
		throw new Error(message)
	}

	return payload
}

export function login(payload) {
	return request('/api/auth/login', {
		method: 'POST',
		body: JSON.stringify(payload),
	})
}

export function register(payload) {
	return request('/api/auth/register', {
		method: 'POST',
		body: JSON.stringify(payload),
	})
}

export function getDashboard() {
	return request('/api/portal/dashboard')
}

export function getResults() {
	return request('/api/portal/results')
}

export function getTimetable() {
	return request('/api/portal/timetable')
}

export function getAnnouncements() {
	return request('/api/portal/announcements')
}

export function getProfile() {
	return request('/api/portal/profile')
}

export function updateProfile(payload) {
	return request('/api/portal/profile', {
		method: 'PUT',
		body: JSON.stringify(payload),
	})
}

export function createAnnouncement(payload) {
	return request('/api/admin/announcements', {
		method: 'POST',
		body: JSON.stringify(payload),
	})
}

export function uploadResult(payload) {
	return request('/api/admin/results', {
		method: 'POST',
		body: JSON.stringify(payload),
	})
}

export function getSections() {
	return request('/api/admin/sections')
}

export function createSection(payload) {
	return request('/api/admin/sections', {
		method: 'POST',
		body: JSON.stringify(payload),
	})
}

export function updateStudentSection(studentId, sectionCode) {
	return request(`/api/admin/students/${encodeURIComponent(studentId)}/section`, {
		method: 'PUT',
		body: JSON.stringify({ sectionCode }),
	})
}

export function getSectionTimetable(sectionCode) {
	return request(`/api/admin/sections/${encodeURIComponent(sectionCode)}/timetable`)
}

export function saveSectionTimetable(sectionCode, payload) {
	return request(`/api/admin/sections/${encodeURIComponent(sectionCode)}/timetable`, {
		method: 'PUT',
		body: JSON.stringify(payload),
	})
}

export async function uploadSectionTimetableCsv(sectionCode, file) {
	const token = localStorage.getItem('token')
	const formData = new FormData()
	formData.append('file', file)

	const response = await fetch(`${API_BASE_URL}/api/admin/sections/${encodeURIComponent(sectionCode)}/timetable/import-csv`, {
		method: 'POST',
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		body: formData,
	})

	const payload = await response.json().catch(() => ({}))
	if (!response.ok) {
		const message = payload?.message ?? payload?.error ?? 'Timetable CSV import failed'
		throw new Error(message)
	}

	return payload
}

export async function uploadResultCsv(file) {
	const token = localStorage.getItem('token')
	const formData = new FormData()
	formData.append('file', file)

	const response = await fetch(`${API_BASE_URL}/api/admin/results/import-csv`, {
		method: 'POST',
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		body: formData,
	})

	const payload = await response.json().catch(() => ({}))
	if (!response.ok) {
		const message = payload?.message ?? payload?.error ?? 'CSV import failed'
		throw new Error(message)
	}

	return payload
}
