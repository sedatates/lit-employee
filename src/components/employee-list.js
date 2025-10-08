import {LitElement, html, css} from 'lit';
import {LocalizeMixin} from '../utils/i18n.js';
import store from '../store/store.js';
import {Router} from '@vaadin/router';

import './confirm-dialog.js';
import './icons.js';
import './checkbox.js';
import './pagination.js';

export class EmployeeList extends LocalizeMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--spacing-xl) var(--spacing-md);
      }

      .container {
        max-width: 1280px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-xl);
        flex-wrap: wrap;
        gap: var(--spacing-md);
      }

      h1 {
        font-size: var(--font-size-3xl);
        font-weight: 400;
        font-family: 'Roboto', sans-serif;
        color: var(--color-primary);
        margin: 0;
      }

      .controls {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
        flex-wrap: wrap;
      }

      .search-box {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      input[type='text'] {
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-base);
        width: 250px;
      }

      .view-toggle {
        display: flex;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs);
        border-radius: var(--radius-md);
      }

      .view-toggle button {
        padding: var(--spacing-sm) var(--spacing-md);
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
        font-size: var(--font-size-sm);
      }

      .table-container {
        overflow-x: auto;
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        background-color: var(--color-gray-50);
        padding: var(--spacing-md);
        text-align: left;
        font-weight: 600;
        color: var(--color-primary);
        border-bottom: 2px solid var(--color-border);
      }

      td {
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
      }

      tr:hover {
        background-color: var(--color-gray-50);
      }

      .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .employee-card {
        background: white;
        padding: var(--spacing-lg);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        transition: box-shadow var(--transition-fast);
      }

      .employee-card:hover {
        box-shadow: var(--shadow-lg);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: var(--spacing-md);
      }

      .card-title {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--color-text);
        margin-bottom: var(--spacing-xs);
      }

      .card-subtitle {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
      }

      .card-body {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-md);
      }

      .card-field {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        overflow-wrap: anywhere;
      }

      .card-field-label {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        font-weight: 500;
        text-transform: uppercase;
      }

      .card-field-value {
        font-size: var(--font-size-base);
        color: var(--color-text);
      }

      /* Actions */
      .actions {
        display: flex;
        gap: var(--spacing-sm);
      }

      .btn {
        padding: var(--spacing-sm);
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: var(--font-size-sm);
        font-weight: 500;
        transition: all var(--transition-fast);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 36px;
      }

      .btn .material-icons {
        font-size: 20px;
      }

      .btn-edit {
        color: white;
        background-color: color-mix(
          in srgb,
          var(--color-primary),
          transparent 90%
        );
      }

      .btn-edit:hover {
      }

      .btn-delete {
        background-color: color-mix(
          in srgb,
          var(--color-danger),
          transparent 80%
        );
      }

      .btn-delete:hover {
      }

      /* Pagination */
      .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--spacing-xl);
        flex-wrap: wrap;
        gap: var(--spacing-md);
      }

      .pagination-info {
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
      }

      .pagination-controls {
        display: flex;
        gap: var(--spacing-sm);
        align-items: center;
      }

      .pagination-controls select {
        padding: var(--spacing-sm);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
      }

      .pagination-controls button {
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--color-border);
        background: white;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .pagination-controls button:hover:not(:disabled) {
        background-color: var(--color-gray-100);
      }

      .pagination-controls button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .no-results {
        text-align: center;
        padding: var(--spacing-2xl);
        color: var(--color-text-secondary);
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .header {
          flex-direction: column;
          align-items: stretch;
        }

        .search-box {
          width: 60%;
        }

        input[type='text'] {
          width: 100%;
        }

        table {
          font-size: var(--font-size-sm);
        }

        th,
        td {
          padding: var(--spacing-sm);
        }
      }
    `;
  }

  static get properties() {
    return {
      employees: {type: Array},
      filteredEmployees: {type: Array},
      viewMode: {type: String},
      searchQuery: {type: String},
      currentPage: {type: Number},
      itemsPerPage: {type: Number},
      selectedEmployees: {type: Array},
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.filteredEmployees = [];
    this.selectedEmployees = [];
    this.viewMode = 'table';
    this.searchQuery = '';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this._unsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadEmployees();
    this._unsubscribe = store.subscribe(() => this._loadEmployees());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  _loadEmployees() {
    this.employees = store.getEmployees();
    this._filterEmployees();
  }

  _filterEmployees() {
    const query = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter((emp) => {
      return (
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.phone.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query)
      );
    });
    this.currentPage = 1;
  }

  _handleSearch(e) {
    this.searchQuery = e.target.value;
    this._filterEmployees();
  }

  _setViewMode(mode) {
    this.viewMode = mode;
  }

  _handleEdit(id) {
    Router.go(`/employees/${id}/edit`);
  }

  _handleCheckboxChange(e, id) {
    const isChecked = e.target.isChecked;
    if (isChecked) {
      if (!this.selectedEmployees.includes(id)) {
        this.selectedEmployees = [...this.selectedEmployees, id];
      }
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(
        (empId) => empId !== id
      );
    }
  }

  _handleSelectAllChange(e, employees) {
    const isChecked = e.target.isChecked;
    const employeeIds = employees.map((emp) => emp.id);
    if (isChecked) {
      const ids = new Set(this.selectedEmployees);
      employeeIds.forEach((id) => ids.add(id));
      this.selectedEmployees = Array.from(ids);
    } else {
      const idsToRemove = new Set(employeeIds);
      this.selectedEmployees = this.selectedEmployees.filter(
        (empId) => !idsToRemove.has(empId)
      );
    }
  }

  _areAllSelected(employees) {
    if (!employees.length) {
      return false;
    }
    return employees.every((emp) => this.selectedEmployees.includes(emp.id));
  }

  _isEmployeeSelected(id) {
    return this.selectedEmployees.includes(id);
  }

  async _handleDelete(employee) {
    const dialog = this.shadowRoot.querySelector('confirm-dialog');

    if (this.selectedEmployees.length > 1) {
      const confirmed = await dialog.show({
        title: this.t('deleteConfirm.title'),
        message: this.t('deleteConfirm.deleteAllMessage'),
        confirmText: this.t('deleteConfirm.confirm'),
        cancelText: this.t('deleteConfirm.cancel'),
        type: 'danger',
        confirmButtonType: 'danger',
      });

      if (confirmed) {
        store.deleteEmployees(this.selectedEmployees);
        this.selectedEmployees = [];
      }
      return;
    }

    const confirmed = await dialog.show({
      title: this.t('deleteConfirm.title'),
      message: `${this.t('deleteConfirm.message')}\n\n${employee.firstName} ${
        employee.lastName
      }`,
      confirmText: this.t('deleteConfirm.confirm'),
      cancelText: this.t('deleteConfirm.cancel'),
      type: 'danger',
      confirmButtonType: 'danger',
    });

    if (confirmed) {
      store.deleteEmployee(employee.id);
      this.selectedEmployees = this.selectedEmployees.filter(
        (empId) => empId !== employee.id
      );
    }
  }

  _changePagingation(e) {
    this.currentPage = e.detail.page;
  }

  _getPaginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredEmployees.slice(start, end);
  }

  _getTotalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  render() {
    const paginatedEmployees = this._getPaginatedEmployees();
    const totalPages = this._getTotalPages();
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(
      start + this.itemsPerPage - 1,
      this.filteredEmployees.length
    );

    return html`
      <div class="container">
        <div class="header">
          <h1>${this.t('employeeList.title')}</h1>
          <div class="controls">
            <div class="search-box">
              <input
                type="text"
                placeholder="${this.t('employeeList.search')}"
                .value="${this.searchQuery}"
                @input="${this._handleSearch}"
              />
            </div>
            <div class="view-toggle">
              <button
                class="${this.viewMode === 'table' ? 'active' : ''}"
                @click="${() => this._setViewMode('table')}"
              >
                <icon-element
                  name=${this.viewMode === 'table'
                    ? 'table-row-active'
                    : 'table-row'}
                  color=${this.viewMode === 'table'
                    ? 'var(--color-primary)'
                    : 'var(--color-gray-400)'}
                ></icon-element>
              </button>
              <button
                class="${this.viewMode === 'list' ? 'active' : ''}"
                @click="${() => this._setViewMode('list')}"
              >
                <icon-element
                  name=${this.viewMode === 'list' ? 'grid-active' : 'grid'}
                  color=${this.viewMode === 'list'
                    ? 'var(--color-primary)'
                    : 'var(--color-gray-400)'}
                ></icon-element>
              </button>
            </div>
          </div>
        </div>

        <!-- Employee List -->

        ${paginatedEmployees.length === 0
          ? html`<div class="no-results">
              ${this.t('employeeList.noResults')}
            </div>`
          : this.viewMode === 'table'
          ? this._renderTableView(paginatedEmployees)
          : this._renderGridView(paginatedEmployees)}

        <!-- Pagination Controls -->

        <pagination-controls
          .currentPage="${this.currentPage}"
          .totalPages="${totalPages}"
          @page-changed="${(e) => this._changePagingation(e)}"
        ></pagination-controls>
      </div>

      <confirm-dialog></confirm-dialog>
    `;
  }

  _renderTableView(employees) {
    return html`
      <div class="table-container hidden">
        <table>
          <thead>
            <tr>
              <th>
                <checkbox-element
                  .isChecked="${this._areAllSelected(employees)}"
                  @change="${(e) => this._handleSelectAllChange(e, employees)}"
                ></checkbox-element>
              </th>
              <th>${this.t('employeeForm.firstName')}</th>
              <th>${this.t('employeeForm.lastName')}</th>
              <th>${this.t('employeeForm.email')}</th>
              <th>${this.t('employeeForm.phone')}</th>
              <th>${this.t('employeeForm.department')}</th>
              <th>${this.t('employeeForm.position')}</th>
              <th>${this.t('actions.edit')}</th>
            </tr>
          </thead>
          <tbody>
            ${employees.map(
              (emp) => html`
                <tr>
                  <td>
                    <checkbox-element
                      .isChecked="${this._isEmployeeSelected(emp.id)}"
                      @change="${(e) => this._handleCheckboxChange(e, emp.id)}"
                    ></checkbox-element>
                  </td>
                  <td>${emp.firstName}</td>
                  <td>${emp.lastName}</td>
                  <td>${emp.email}</td>
                  <td>${emp.phone}</td>
                  <td>
                    ${this.t(`departments.${emp.department.toLowerCase()}`)}
                  </td>
                  <td>${this.t(`positions.${emp.position.toLowerCase()}`)}</td>
                  <td>
                    <div class="actions">
                      <button
                        class="btn btn-edit"
                        @click="${() => this._handleEdit(emp.id)}"
                        title="${this.t('actions.edit')}"
                      >
                        <icon-element
                          name="edit"
                          color="var(--color-primary)"
                        />
                      </button>
                      <button
                        class="btn btn-delete"
                        @click="${() => this._handleDelete(emp)}"
                        title="${this.t('actions.delete')}"
                      >
                        <icon-element
                          name="delete"
                          color="var(--color-primary)"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  _renderGridView(employees) {
    return html`
      <div class="grid-container">
        ${employees.map(
          (emp) => html`
            <div class="employee-card">
              <div class="card-header">
                <div>
                  <div class="card-title">${emp.firstName} ${emp.lastName}</div>
                  <div class="card-subtitle">
                    ${this.t(`departments.${emp.department.toLowerCase()}`)} -
                    ${this.t(`positions.${emp.position.toLowerCase()}`)}
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="card-field">
                  <div class="card-field-label">
                    ${this.t('employeeForm.email')}
                  </div>
                  <div class="card-field-value">${emp.email}</div>
                </div>
                <div class="card-field">
                  <div class="card-field-label">
                    ${this.t('employeeForm.phone')}
                  </div>
                  <div class="card-field-value">${emp.phone}</div>
                </div>
                <div class="card-field">
                  <div class="card-field-label">
                    ${this.t('employeeForm.dateOfBirth')}
                  </div>
                  <div class="card-field-value">${emp.dateOfBirth}</div>
                </div>
                <div class="card-field">
                  <div class="card-field-label">
                    ${this.t('employeeForm.dateOfEmployment')}
                  </div>
                  <div class="card-field-value">${emp.dateOfEmployment}</div>
                </div>

                <div class="actions">
                  <button
                    class="btn btn-edit"
                    style="background-color: var(--color-secondary); gap: var(--spacing-xs); color: white;"
                    @click="${() => this._handleEdit(emp.id)}"
                    title="${this.t('actions.edit')}"
                  >
                    <icon-element name="edit" color="white"></icon-element>
                    <p>${this.t('actions.edit')}</p>
                  </button>
                  <button
                    class="btn btn-delete"
                    style="background-color: var(--color-primary); gap: var(--spacing-xs); color: white;"
                    @click="${() => this._handleDelete(emp)}"
                    title="${this.t('actions.delete')}"
                  >
                    <icon-element name="delete" color="white"></icon-element>
                    <p>${this.t('actions.delete')}</p>
                  </button>
                </div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
