const STORAGE_KEY = 'employee-management-data';

import {sampleEmployees} from './constants.js';

class Store {
  constructor() {
    this.state = {
      employees: [],
    };
    this.listeners = new Set();
    this.loadFromStorage();
  }

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

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  getState() {
    return {...this.state};
  }

  getEmployees() {
    return [...this.state.employees];
  }

  getEmployeeById(id) {
    return this.state.employees.find((emp) => emp.id === id);
  }

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

  updateEmployee(id, updatedData) {
    this.state.employees = this.state.employees.map((emp) =>
      emp.id === id ? {...emp, ...updatedData} : emp
    );
    this.saveToStorage();
    this.notify();
  }

  deleteEmployee(id) {
    this.state.employees = this.state.employees.filter((emp) => emp.id !== id);
    this.saveToStorage();
    this.notify();
  }

  emailExists(email, excludeId = null) {
    return this.state.employees.some(
      (emp) => emp.email === email && emp.id !== excludeId
    );
  }

  initializeSampleData() {
    if (this.state.employees.length === 0) {
      this.state.employees = sampleEmployees;
      this.saveToStorage();
      this.notify();
    }
  }
}

// Create singleton instance
const store = new Store();

export default store;
