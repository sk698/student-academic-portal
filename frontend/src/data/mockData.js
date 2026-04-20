export const portalUser = {
  name: 'Julian Casablancas',
  program: 'Computer Science',
  year: 'Year 3',
  avatarInitials: 'JC',
}

export const studentProfile = {
  name: 'Julian Casablancas',
  program: 'B.Tech Computer Science',
  semester: 'Semester 6',
  status: 'Active Status',
  avatarInitials: 'JC',
  studentId: 'ST-2024-8849',
  email: 'julian.casablancas@scholarsanctuary.edu',
  phone: '+91 98765 43210',
  department: 'Computer Science & Engineering',
  dob: '2003-08-26',
  address: '24, New Residency Road, Bengaluru',
}

export const dashboardStats = [
  { label: 'Cumulative GPA', value: '9.04', trend: 'Top 5% of your cohort' },
  { label: 'Attendance', value: '94%', trend: '+2.4% vs last month' },
  { label: 'Credits Earned', value: '102 / 120', trend: 'On track for honors' },
]

export const upcomingClasses = [
  { course: 'Advanced Algorithms', time: '10:00 AM', room: 'Hall B4', faculty: 'Dr. Aris Thorne', type: 'In Person' },
  { course: 'Ethics in Technology', time: '02:30 PM', room: 'Virtual Room 12', faculty: 'Prof. Sarah Jenkins', type: 'Online' },
  { course: 'Database Studio', time: '04:00 PM', room: 'Lab C2', faculty: 'Dr. R. Menon', type: 'Lab' },
]

export const recentResults = [
  { course: 'Network Security', type: 'Midterm Exam', code: 'CS430', grade: 'A-' },
  { course: 'Database Management', type: 'Lab Report 04', code: 'CS402', grade: 'A' },
  { course: 'Operating Systems', type: 'Quiz 3', code: 'CS305', grade: 'B+' },
]

export const assignments = [
  { title: 'OS Process Scheduling Report', due: 'Due Apr 12', progress: 72, status: 'In Progress' },
  { title: 'DBMS Query Optimization Sheet', due: 'Due Apr 14', progress: 38, status: 'In Progress' },
  { title: 'Networks Quiz 3', due: 'Due Apr 16', progress: 100, status: 'Completed' },
]

export const resultSummary = {
  cgpa: '9.04',
  majorGpa: '9.24',
  credits: '102 / 120',
  ranking: 'Top 5% of Department',
  deansList: '4 Semesters',
  standing: 'Excellent',
}

export const resultsBreakdown = [
  { courseCode: 'CS401', courseName: 'Advanced Algorithms', semester: 'Fall 2025', grade: 'A' },
  { courseCode: 'MATH302', courseName: 'Linear Algebra II', semester: 'Fall 2025', grade: 'A-' },
  { courseCode: 'PHY210', courseName: 'Quantum Mechanics', semester: 'Spring 2025', grade: 'B+' },
  { courseCode: 'CS385', courseName: 'Compiler Design', semester: 'Spring 2025', grade: 'A' },
  { courseCode: 'CS370', courseName: 'Cloud Computing', semester: 'Fall 2024', grade: 'A-' },
  { courseCode: 'EC201', courseName: 'Digital Systems', semester: 'Fall 2024', grade: 'B' },
]

export const timetableDays = [
  { day: 'Mon', date: 12 },
  { day: 'Tue', date: 13 },
  { day: 'Wed', date: 14 },
  { day: 'Thu', date: 15 },
  { day: 'Fri', date: 16 },
  { day: 'Sat', date: 17 },
]

export const timetableSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

export const timetableEvents = [
  { id: 1, day: 1, start: 1, duration: 2, title: 'Operating Systems', room: 'B-203', tone: 'blue' },
  { id: 2, day: 1, start: 5, duration: 2, title: 'Database Lab', room: 'Lab-3', tone: 'emerald' },
  { id: 3, day: 2, start: 2, duration: 2, title: 'Algorithms', room: 'A-121', tone: 'indigo' },
  { id: 4, day: 3, start: 4, duration: 2, title: 'AI Seminar', room: 'Seminar Hall', tone: 'amber' },
  { id: 5, day: 4, start: 1, duration: 3, title: 'Computer Networks', room: 'C-307', tone: 'cyan' },
  { id: 6, day: 5, start: 6, duration: 2, title: 'Project Studio', room: 'Innovation Lab', tone: 'violet' },
  { id: 7, day: 6, start: 3, duration: 2, title: 'Open Elective', room: 'D-108', tone: 'rose' },
]

export const timetableInsights = [
  { label: 'Focus Sessions Today', value: '03', note: 'Most productive between 10:00 and 12:00' },
  { label: 'Weekly Load', value: '28 hrs', note: 'Balanced with two self-study blocks' },
]

export const announcementHero = {
  title: 'Emergency: Campus Maintenance & Temporary Power Outage',
  date: 'October 24, 2025',
  content:
    'Essential electrical maintenance will take place across the North Campus this weekend. Power may be intermittently unavailable from 08:00 to 18:00 on Saturday. Students in campus housing are advised to charge critical devices in advance.',
}

export const announcementFeatured = {
  title: 'Spring Semester Enrollment Now Open',
  content:
    'Secure your course selections for the upcoming term. Priority registration ends November 15th.',
}

export const announcements = [
  {
    id: 1,
    title: 'New Library Resources for Research Students',
    body: 'Digital subscriptions have expanded to include new IEEE journals and updated JSTOR archival collections.',
    source: 'Library Services',
    date: 'Oct 22, 2025',
    priority: 'Normal',
  },
  {
    id: 2,
    title: 'Career Fair: Tech & Innovation 2025',
    body: 'Meet recruiters from top firms and emerging startups in the Great Hall next Wednesday.',
    source: 'Student Affairs',
    date: 'Oct 20, 2025',
    priority: 'Normal',
  },
  {
    id: 3,
    title: 'Scholarship Verification Deadline Reminder',
    body: 'All document uploads must be completed by October 28, 2025 for disbursal eligibility.',
    source: 'Academic Office',
    date: 'Oct 19, 2025',
    priority: 'High',
  },
]

export const adminRecent = [
  { title: 'End of Term Library Hours', posted: '2h ago', priority: 'Standard' },
  { title: 'Mandatory Internship Orientation', posted: '5h ago', priority: 'High Priority' },
  { title: 'Revised Lab Safety Circular', posted: '1d ago', priority: 'Standard' },
]