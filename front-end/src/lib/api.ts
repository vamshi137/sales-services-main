import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configure your PHP backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-domain.com/api';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/refresh.php`, {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('token', token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/login.php', { email, password }),
  
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => api.post('/register.php', data),
  
  logout: () => api.post('/logout.php'),
  
  refreshToken: (refreshToken: string) =>
    api.post('/refresh.php', { refreshToken }),
  
  getProfile: () => api.get('/profile.php'),
  
  updateProfile: (data: Partial<User>) =>
    api.put('/profile.php', data),
};

// Employee API endpoints
export const employeeAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string; department?: string }) =>
    api.get('/employees.php', { params }),
  
  getById: (id: string) => api.get(`/employees.php?id=${id}`),
  
  create: (data: Partial<Employee>) => api.post('/employees.php', data),
  
  update: (id: string, data: Partial<Employee>) =>
    api.put('/employees.php', { id, ...data }),
  
  delete: (id: string) => api.delete(`/employees.php?id=${id}`),
};

// Attendance API endpoints
export const attendanceAPI = {
  getAll: (params?: { date?: string; employeeId?: string; month?: string }) =>
    api.get('/attendance.php', { params }),
  
  punchIn: (employeeId: string) =>
    api.post('/attendance.php', { action: 'punch_in', employeeId }),
  
  punchOut: (employeeId: string) =>
    api.post('/attendance.php', { action: 'punch_out', employeeId }),
  
  getMonthly: (employeeId: string, month: string) =>
    api.get('/attendance.php', { params: { employeeId, month, type: 'monthly' } }),
};

// Leave API endpoints
export const leaveAPI = {
  getAll: (params?: { status?: string; employeeId?: string }) =>
    api.get('/leave.php', { params }),
  
  apply: (data: {
    leaveType: string;
    fromDate: string;
    toDate: string;
    reason: string;
  }) => api.post('/leave.php', data),
  
  approve: (id: string, status: 'approved' | 'rejected', remarks?: string) =>
    api.put('/leave.php', { id, status, remarks }),
  
  getBalance: (employeeId: string) =>
    api.get('/leave.php', { params: { employeeId, type: 'balance' } }),
};

// Payroll API endpoints
export const payrollAPI = {
  getAll: (params?: { month?: string; year?: string }) =>
    api.get('/payroll.php', { params }),
  
  getByEmployee: (employeeId: string, month?: string) =>
    api.get('/payroll.php', { params: { employeeId, month } }),
  
  generatePayslip: (employeeId: string, month: string) =>
    api.post('/payroll.php', { action: 'generate', employeeId, month }),
  
  processPayroll: (month: string, year: string) =>
    api.post('/payroll.php', { action: 'process', month, year }),
};

// Recruitment API endpoints
export const recruitmentAPI = {
  getJobs: () => api.get('/recruitment.php?type=jobs'),
  
  createJob: (data: Partial<Job>) => api.post('/recruitment.php', { type: 'job', ...data }),
  
  getCandidates: (jobId?: string) =>
    api.get('/recruitment.php', { params: { type: 'candidates', jobId } }),
  
  updateCandidate: (id: string, data: Partial<Candidate>) =>
    api.put('/recruitment.php', { type: 'candidate', id, ...data }),
};

// Performance API endpoints
export const performanceAPI = {
  getAll: (params?: { employeeId?: string; period?: string }) =>
    api.get('/performance.php', { params }),
  
  createGoal: (data: Partial<Goal>) =>
    api.post('/performance.php', { type: 'goal', ...data }),
  
  submitAppraisal: (data: Partial<Appraisal>) =>
    api.post('/performance.php', { type: 'appraisal', ...data }),
  
  getRatings: (employeeId: string) =>
    api.get('/performance.php', { params: { employeeId, type: 'ratings' } }),
};

// Training API endpoints
export const trainingAPI = {
  getPrograms: () => api.get('/training.php?type=programs'),
  
  getNominations: (employeeId?: string) =>
    api.get('/training.php', { params: { type: 'nominations', employeeId } }),
  
  nominate: (programId: string, employeeId: string) =>
    api.post('/training.php', { type: 'nominate', programId, employeeId }),
};

// Assets API endpoints
export const assetsAPI = {
  getAll: () => api.get('/assets.php'),
  
  getByEmployee: (employeeId: string) =>
    api.get('/assets.php', { params: { employeeId } }),
  
  issue: (assetId: string, employeeId: string) =>
    api.post('/assets.php', { action: 'issue', assetId, employeeId }),
  
  return: (assetId: string) =>
    api.post('/assets.php', { action: 'return', assetId }),
};

// Travel & Expense API endpoints
export const travelAPI = {
  getRequests: (status?: string) =>
    api.get('/travel.php', { params: { status } }),
  
  createRequest: (data: Partial<TravelRequest>) =>
    api.post('/travel.php', data),
  
  approve: (id: string, status: 'approved' | 'rejected') =>
    api.put('/travel.php', { id, status }),
  
  submitExpense: (data: Partial<Expense>) =>
    api.post('/travel.php', { type: 'expense', ...data }),
};

// Reports API endpoints
export const reportsAPI = {
  getHeadcount: (params?: { department?: string; date?: string }) =>
    api.get('/reports.php', { params: { type: 'headcount', ...params } }),
  
  getAttendanceSummary: (params?: { month?: string; department?: string }) =>
    api.get('/reports.php', { params: { type: 'attendance', ...params } }),
  
  getPayrollSummary: (params?: { month?: string; year?: string }) =>
    api.get('/reports.php', { params: { type: 'payroll', ...params } }),
  
  getAttrition: (params?: { year?: string }) =>
    api.get('/reports.php', { params: { type: 'attrition', ...params } }),
  
  getLeaveBalance: (params?: { department?: string }) =>
    api.get('/reports.php', { params: { type: 'leave-balance', ...params } }),
};

// Dashboard API endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard.php?type=stats'),
  
  getRecentActivities: () => api.get('/dashboard.php?type=activities'),
  
  getNotifications: () => api.get('/dashboard.php?type=notifications'),
  
  getQuickStats: () => api.get('/dashboard.php?type=quick-stats'),
};

// Organization API endpoints
export const organizationAPI = {
  getCompany: () => api.get('/organization.php?type=company'),
  
  getBranches: () => api.get('/organization.php?type=branches'),
  
  getDepartments: () => api.get('/organization.php?type=departments'),
  
  getDesignations: () => api.get('/organization.php?type=designations'),
};

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'manager' | 'employee' | 'accounts';
  employeeId?: string;
  avatar?: string;
  department?: string;
  designation?: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  maritalStatus: string;
  presentAddress: string;
  permanentAddress: string;
  emergencyContact: string;
  aadhaarNumber: string;
  panNumber: string;
  uanNumber: string;
  esicNumber: string;
  dateOfJoining: string;
  employmentType: string;
  department: string;
  designation: string;
  grade: string;
  reportingManager: string;
  workLocation: string;
  shiftType: string;
  probationPeriod: string;
  confirmationDate: string;
  status: 'active' | 'inactive' | 'on-leave' | 'terminated';
  avatar?: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  inTime: string;
  outTime: string;
  totalHours: number;
  shift: string;
  status: 'present' | 'absent' | 'half-day' | 'on-leave' | 'holiday';
  lateMarks: number;
  overtime: number;
}

export interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  approvedBy?: string;
  remarks?: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: string;
  payDays: number;
  grossSalary: number;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  medicalAllowance: number;
  otherAllowances: number;
  pfEmployee: number;
  pfEmployer: number;
  esicEmployee: number;
  esicEmployer: number;
  professionalTax: number;
  tds: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid';
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  openings: number;
  status: 'open' | 'closed' | 'on-hold';
  postedDate: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resume: string;
  status: 'new' | 'screening' | 'interview' | 'selected' | 'rejected' | 'on-hold';
  source: string;
  expectedSalary: number;
  currentSalary: number;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  weightage: number;
  achievement: number;
}

export interface Appraisal {
  id: string;
  employeeId: string;
  period: string;
  selfRating: number;
  managerRating: number;
  finalRating: number;
  status: 'draft' | 'submitted' | 'reviewed' | 'finalized';
}

export interface TravelRequest {
  id: string;
  employeeId: string;
  purpose: string;
  destination: string;
  fromDate: string;
  toDate: string;
  travelType: 'local' | 'outstation' | 'international';
  advanceAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export interface Expense {
  id: string;
  travelRequestId: string;
  category: string;
  amount: number;
  receipt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default api;
