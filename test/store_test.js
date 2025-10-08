import {MyElement} from '../my-element.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

const STORAGE_KEY = 'employee-management-data';

let StoreCtor;
const loadStoreCtor = async () => {
  if (!StoreCtor) {
    const module = await import('../src/store/store.js');
    StoreCtor = module.default.constructor;
  }
  return StoreCtor;
};

const createStore = async (persistedState) => {
  localStorage.clear();
  if (persistedState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
  }
  await fixture(html`<div></div>`);
  const Store = await loadStoreCtor();
  return new Store();
};

teardown(() => {
  localStorage.clear();
});

suite('store', () => {
  test('initializes with empty employees when storage is empty', async () => {
    assert.ok(MyElement);
    const store = await createStore();
    assert.deepEqual(store.getEmployees(), []);
    assert.deepEqual(store.getState(), {employees: []});
  });

  test('loadFromStorage reads persisted data and saveToStorage writes updates', async () => {
    const persistedState = {
      employees: [
        {
          id: '1',
          firstName: 'Persisted',
          lastName: 'Employee',
          email: 'persisted@example.com',
        },
      ],
    };

    const store = await createStore(persistedState);
    assert.deepEqual(store.getEmployees(), persistedState.employees);

    const updatedState = {
      employees: [
        {
          id: '2',
          firstName: 'Updated',
          lastName: 'Person',
          email: 'updated@example.com',
        },
      ],
    };

    store.state = updatedState;
    store.saveToStorage();

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    assert.deepEqual(saved, updatedState);
  });

  test('add, update, and delete employee keep state and storage in sync', async () => {
    const store = await createStore();
    const originalDateNow = Date.now;
    Date.now = () => 1700000000000;

    try {
      const draftEmployee = {
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        department: 'Tech',
        position: 'Senior',
      };

      const addedEmployee = store.addEmployee(draftEmployee);
      assert.equal(addedEmployee.id, '1700000000000');
      assert.deepEqual(store.getEmployees(), [addedEmployee]);

      let persisted = JSON.parse(localStorage.getItem(STORAGE_KEY));
      assert.deepEqual(persisted.employees, [addedEmployee]);

      store.updateEmployee(addedEmployee.id, {
        firstName: 'Augusta',
        department: 'Research',
      });

      const updatedEmployee = store.getEmployeeById(addedEmployee.id);
      assert.equal(updatedEmployee.firstName, 'Augusta');
      assert.equal(updatedEmployee.department, 'Research');

      persisted = JSON.parse(localStorage.getItem(STORAGE_KEY));
      assert.deepEqual(persisted.employees[0], {
        ...addedEmployee,
        firstName: 'Augusta',
        department: 'Research',
      });

      store.deleteEmployee(addedEmployee.id);
      assert.deepEqual(store.getEmployees(), []);

      persisted = JSON.parse(localStorage.getItem(STORAGE_KEY));
      assert.deepEqual(persisted.employees, []);
    } finally {
      Date.now = originalDateNow;
    }
  });
});
