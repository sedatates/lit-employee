const STORAGE_KEY = 'employee-management-data';

class Store {
  constructor() {
    this.state = {
      employees: [],
    };
    this.listeners = new Set();
    this.loadFromStorage();
  }

  // Load state from localStorage
  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.state = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  // Save state to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners
  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Get current state
  getState() {
    return {...this.state};
  }

  // Get all employees
  getEmployees() {
    return [...this.state.employees];
  }

  // Get employee by ID
  getEmployeeById(id) {
    return this.state.employees.find((emp) => emp.id === id);
  }

  // Add new employee
  addEmployee(employee) {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(), // Simple ID generation
    };
    this.state.employees = [...this.state.employees, newEmployee];
    this.saveToStorage();
    this.notify();
    return newEmployee;
  }

  // Update employee
  updateEmployee(id, updatedData) {
    this.state.employees = this.state.employees.map((emp) =>
      emp.id === id ? {...emp, ...updatedData} : emp
    );
    this.saveToStorage();
    this.notify();
  }

  // Delete employee
  deleteEmployee(id) {
    this.state.employees = this.state.employees.filter((emp) => emp.id !== id);
    this.saveToStorage();
    this.notify();
  }

  // Check if email exists (for validation)
  emailExists(email, excludeId = null) {
    return this.state.employees.some(
      (emp) => emp.email === email && emp.id !== excludeId
    );
  }

  // Initialize with sample data if empty
  initializeSampleData() {
    if (this.state.employees.length === 0) {
      const sampleEmployees = [
        {
          id: '1',
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          dateOfEmployment: '2020-01-15',
          dateOfBirth: '1990-05-20',
          phone: '+90 555 123 4567',
          email: 'ahmet.yilmaz@example.com',
          department: 'Tech',
          position: 'Senior',
        },
        {
          id: '2',
          firstName: 'Ayşe',
          lastName: 'Demir',
          dateOfEmployment: '2021-03-10',
          dateOfBirth: '1992-08-15',
          phone: '+90 555 234 5678',
          email: 'ayse.demir@example.com',
          department: 'Analytics',
          position: 'Medior',
        },
        {
          id: '3',
          firstName: 'Mehmet',
          lastName: 'Kaya',
          dateOfEmployment: '2022-06-01',
          dateOfBirth: '1995-12-10',
          phone: '+90 555 345 6789',
          email: 'mehmet.kaya@example.com',
          department: 'Tech',
          position: 'Junior',
        },
        {
          id: '4',
          firstName: 'Elif',
          lastName: 'Çelik',
          dateOfEmployment: '2019-11-20',
          dateOfBirth: '1988-03-25',
          phone: '+90 555 456 7890',
          email: 'elif.celik@example.com',
          department: 'HR',
          position: 'Senior',
        },
        {
          id: '5',
          firstName: 'Can',
          lastName: 'Aydın',
          dateOfEmployment: '2023-02-14',
          dateOfBirth: '1998-07-30',
          phone: '+90 555 567 8901',
          email: 'can.aydin@example.com',
          department: 'Marketing',
          position: 'Junior',
        },
      ];

      this.state.employees = sampleEmployees;
      this.saveToStorage();
      this.notify();
    }
  }
}

// Create singleton instance
const store = new Store();

export default store;
