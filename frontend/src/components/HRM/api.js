
// Mock data for demo purposes
const MOCK_DATA = {
  employees: [
    { _id: '1', name: 'John Doe', email: 'john@company.com', department: 'Engineering', position: 'Senior Developer', salary: 85000 },
    { _id: '2', name: 'Jane Smith', email: 'jane@company.com', department: 'Marketing', position: 'Marketing Manager', salary: 75000 },
    { _id: '3', name: 'Mike Johnson', email: 'mike@company.com', department: 'HR', position: 'HR Specialist', salary: 65000 }
  ],
  leaves: [
    { _id: '1', employeeId: '1', employeeName: 'John Doe', startDate: '2024-01-15', endDate: '2024-01-20', type: 'Vacation', status: 'Approved' },
    { _id: '2', employeeId: '2', employeeName: 'Jane Smith', startDate: '2024-02-10', endDate: '2024-02-12', type: 'Sick', status: 'Pending' }
  ],
  payroll: [
    { _id: '1', employeeId: '1', employeeName: 'John Doe', month: 'January 2024', salary: 85000, deductions: 15000, netPay: 70000 },
    { _id: '2', employeeId: '2', employeeName: 'Jane Smith', month: 'January 2024', salary: 75000, deductions: 13000, netPay: 62000 }
  ],
  recruitment: [
    { _id: '1', position: 'Frontend Developer', department: 'Engineering', status: 'Open', applicants: 15 },
    { _id: '2', position: 'UX Designer', department: 'Design', status: 'Closed', applicants: 8 }
  ],
  reviews: [
    { _id: '1', employeeId: '1', employeeName: 'John Doe', reviewPeriod: 'Q4 2023', rating: 4.5, feedback: 'Excellent performance' },
    { _id: '2', employeeId: '2', employeeName: 'Jane Smith', reviewPeriod: 'Q4 2023', rating: 4.2, feedback: 'Good teamwork and communication' }
  ],
  offerLetters: [
    { _id: '1', candidateName: 'Sarah Wilson', position: 'Frontend Developer', salary: 75000, startDate: '2024-03-01', status: 'Sent' },
    { _id: '2', candidateName: 'David Brown', position: 'UX Designer', salary: 70000, startDate: '2024-03-15', status: 'Draft' }
  ]
};

// Mock API functions that return promises
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Employee API
export const getEmployees = async () => {
  await delay(300);
  return { data: MOCK_DATA.employees };
};

export const addEmployee = async (data) => {
  await delay(500);
  const newEmployee = { ...data, _id: Date.now().toString() };
  MOCK_DATA.employees.push(newEmployee);
  return { data: newEmployee };
};

export const updateEmployee = async (id, data) => {
  await delay(500);
  const index = MOCK_DATA.employees.findIndex(emp => emp._id === id);
  if (index !== -1) {
    MOCK_DATA.employees[index] = { ...data, _id: id };
    return { data: MOCK_DATA.employees[index] };
  }
  throw new Error('Employee not found');
};

export const deleteEmployee = async (id) => {
  await delay(500);
  const index = MOCK_DATA.employees.findIndex(emp => emp._id === id);
  if (index !== -1) {
    MOCK_DATA.employees.splice(index, 1);
    return { data: { message: 'Employee deleted successfully' } };
  }
  throw new Error('Employee not found');
};

// Leave API
export const getLeaves = async () => {
  await delay(300);
  return { data: MOCK_DATA.leaves };
};

export const addLeave = async (data) => {
  await delay(500);
  const newLeave = { ...data, _id: Date.now().toString() };
  MOCK_DATA.leaves.push(newLeave);
  return { data: newLeave };
};

export const updateLeave = async (id, data) => {
  await delay(500);
  const index = MOCK_DATA.leaves.findIndex(lv => lv._id === id);
  if (index !== -1) {
    MOCK_DATA.leaves[index] = { ...data, _id: id };
    return { data: MOCK_DATA.leaves[index] };
  }
  throw new Error('Leave record not found');
};

export const deleteLeave = async (id) => {
  await delay(500);
  const index = MOCK_DATA.leaves.findIndex(lv => lv._id === id);
  if (index !== -1) {
    MOCK_DATA.leaves.splice(index, 1);
    return { data: { message: 'Leave deleted successfully' } };
  }
  throw new Error('Leave record not found');
};

// Payroll API
export const getPayrolls = async () => {
  await delay(300);
  return { data: MOCK_DATA.payroll };
};

export const addPayroll = async (data) => {
  await delay(500);
  const newPayroll = { ...data, _id: Date.now().toString() };
  MOCK_DATA.payroll.push(newPayroll);
  return { data: newPayroll };
};

export const updatePayroll = async (id, data) => {
  await delay(500);
  const index = MOCK_DATA.payroll.findIndex(pr => pr._id === id);
  if (index !== -1) {
    MOCK_DATA.payroll[index] = { ...data, _id: id };
    return { data: MOCK_DATA.payroll[index] };
  }
  throw new Error('Payroll record not found');
};

export const deletePayroll = async (id) => {
  await delay(500);
  const index = MOCK_DATA.payroll.findIndex(pr => pr._id === id);
  if (index !== -1) {
    MOCK_DATA.payroll.splice(index, 1);
    return { data: { message: 'Payroll deleted successfully' } };
  }
  throw new Error('Payroll record not found');
};

// Recruitment API
export const getRecruitments = async () => {
  await delay(300);
  return { data: MOCK_DATA.recruitment };
};

export const addRecruitment = async (data) => {
  await delay(500);
  const newJob = { ...data, _id: Date.now().toString() };
  MOCK_DATA.recruitment.push(newJob);
  return { data: newJob };
};

export const updateRecruitment = async (id, data) => {
  await delay(500);
  const index = MOCK_DATA.recruitment.findIndex(job => job._id === id);
  if (index !== -1) {
    MOCK_DATA.recruitment[index] = { ...data, _id: id };
    return { data: MOCK_DATA.recruitment[index] };
  }
  throw new Error('Job posting not found');
};

export const deleteRecruitment = async (id) => {
  await delay(500);
  const index = MOCK_DATA.recruitment.findIndex(job => job._id === id);
  if (index !== -1) {
    MOCK_DATA.recruitment.splice(index, 1);
    return { data: { message: 'Job posting deleted successfully' } };
  }
  throw new Error('Job posting not found');
};

// Reviews API
export const getReviews = async () => {
  await delay(300);
  return { data: MOCK_DATA.reviews };
};

export const addReview = async (data) => {
  await delay(500);
  const newReview = { ...data, _id: Date.now().toString() };
  MOCK_DATA.reviews.push(newReview);
  return { data: newReview };
};

export const updateReview = async (id, data) => {
  await delay(500);
  const index = MOCK_DATA.reviews.findIndex(review => review._id === id);
  if (index !== -1) {
    MOCK_DATA.reviews[index] = { ...data, _id: id };
    return { data: MOCK_DATA.reviews[index] };
  }
  throw new Error('Review not found');
};

export const deleteReview = async (id) => {
  await delay(500);
  const index = MOCK_DATA.reviews.findIndex(review => review._id === id);
  if (index !== -1) {
    MOCK_DATA.reviews.splice(index, 1);
    return { data: { message: 'Review deleted successfully' } };
  }
  throw new Error('Review not found');
};

// Offer Letter API
export const getOfferLetters = async () => {
  await delay(300);
  return { data: MOCK_DATA.offerLetters };
};

export const addOfferLetter = async (data) => {
  await delay(500);
  const newOfferLetter = { ...data, _id: Date.now().toString() };
  MOCK_DATA.offerLetters.push(newOfferLetter);
  return { data: newOfferLetter };
};

export const updateOfferLetter = async (id, data) => {
  await delay(500);
  const index = MOCK_DATA.offerLetters.findIndex(ol => ol._id === id);
  if (index !== -1) {
    MOCK_DATA.offerLetters[index] = { ...data, _id: id };
    return { data: MOCK_DATA.offerLetters[index] };
  }
  throw new Error('Offer letter not found');
};

export const deleteOfferLetter = async (id) => {
  await delay(500);
  const index = MOCK_DATA.offerLetters.findIndex(ol => ol._id === id);
  if (index !== -1) {
    MOCK_DATA.offerLetters.splice(index, 1);
    return { data: { message: 'Offer letter deleted successfully' } };
  }
  throw new Error('Offer letter not found');
};
