import {LitElement, html, css} from 'lit';
import {LocalizeMixin} from '../utils/i18n.js';
import store from '../store/store.js';
import {resolveAppPath} from '../utils/base-path.js';
import './confirm-dialog.js';

export class EmployeeForm extends LocalizeMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--spacing-xl) var(--spacing-md);
      }

      .container {
        max-width: 800px;
        margin: 0 auto;
      }

      h1 {
        font-size: var(--font-size-3xl);
        color: var(--color-text);
        margin-bottom: var(--spacing-xl);
      }

      .form-card {
        background: white;
        padding: var(--spacing-xl);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-xl);
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
      }

      .form-group.full-width {
        grid-column: 1 / -1;
      }

      label {
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-text);
      }

      label .required {
        color: var(--color-danger);
      }

      input,
      select {
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-base);
        font-family: var(--font-family);
        transition: border-color var(--transition-fast);
      }

      input:focus,
      select:focus {
        outline: none;
        border-color: var(--color-primary);
      }

      input.error,
      select.error {
        border-color: var(--color-danger);
      }

      .error-message {
        font-size: var(--font-size-xs);
        color: var(--color-danger);
        margin-top: var(--spacing-xs);
      }

      .form-actions {
        display: flex;
        gap: var(--spacing-md);
        justify-content: flex-end;
      }

      .btn {
        padding: var(--spacing-md) var(--spacing-xl);
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: var(--font-size-base);
        font-weight: 500;
        transition: all var(--transition-fast);
      }

      .btn-primary {
        background-color: var(--color-primary);
        color: white;
      }

      .btn-primary:hover {
        background-color: var(--color-primary-dark);
      }

      .btn-secondary {
        background-color: var(--color-gray-200);
        color: var(--color-text);
      }

      .btn-secondary:hover {
        background-color: var(--color-gray-300);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }

        .form-actions {
          flex-direction: column-reverse;
        }

        .btn {
          width: 100%;
        }
      }
    `;
  }

  static get properties() {
    return {
      employeeId: {type: String},
      formData: {type: Object},
      errors: {type: Object},
    };
  }

  constructor() {
    super();
    this.employeeId = null;
    this.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };
    this.errors = {};
  }

  connectedCallback() {
    super.connectedCallback();
    // Get employee ID from route params if editing
    if (this.location?.params?.id) {
      this.employeeId = this.location.params.id;
      const employee = store.getEmployeeById(this.employeeId);
      if (employee) {
        this.formData = {...employee};
      }
    }
  }

  _handleInput(field, value) {
    this.formData = {
      ...this.formData,
      [field]: value,
    };
    // Clear error when user starts typing
    if (this.errors[field]) {
      this.errors = {
        ...this.errors,
        [field]: null,
      };
    }
  }

  _validateForm() {
    const errors = {};

    // First Name
    if (!this.formData.firstName.trim()) {
      errors.firstName = this.t('validation.required');
    }

    // Last Name
    if (!this.formData.lastName.trim()) {
      errors.lastName = this.t('validation.required');
    }

    // Email
    if (!this.formData.email.trim()) {
      errors.email = this.t('validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
      errors.email = this.t('validation.invalidEmail');
    } else if (store.emailExists(this.formData.email, this.employeeId)) {
      errors.email = this.t('validation.emailExists');
    }

    // Phone
    if (!this.formData.phone.trim()) {
      errors.phone = this.t('validation.required');
    } else if (!/^\+?[\d\s-()]+$/.test(this.formData.phone)) {
      errors.phone = this.t('validation.invalidPhone');
    }

    // Date of Employment
    if (!this.formData.dateOfEmployment) {
      errors.dateOfEmployment = this.t('validation.required');
    }

    // Date of Birth
    if (!this.formData.dateOfBirth) {
      errors.dateOfBirth = this.t('validation.required');
    } else {
      const birthDate = new Date(this.formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        errors.dateOfBirth = this.t('validation.minAge');
      }
    }

    // Department
    if (!this.formData.department) {
      errors.department = this.t('validation.required');
    }

    // Position
    if (!this.formData.position) {
      errors.position = this.t('validation.required');
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  async _handleSubmit(e) {
    e.preventDefault();

    if (!this._validateForm()) {
      return;
    }

    if (this.employeeId) {
      // Edit mode - show confirmation
      const dialog = this.shadowRoot.querySelector('confirm-dialog');

      const confirmed = await dialog.show({
        title: this.t('employeeForm.confirmUpdateTitle'),
        message: this.t('employeeForm.confirmUpdate'),
        confirmText: this.t('actions.yes'),
        cancelText: this.t('actions.no'),
        type: 'warning',
        confirmButtonType: 'primary',
      });

      if (!confirmed) return;

      store.updateEmployee(this.employeeId, this.formData);
    } else {
      // Add mode
      store.addEmployee(this.formData);
    }

    // Navigate back to list
    this._navigateToList();
  }

  _handleCancel() {
    this._navigateToList();
  }

  _navigateToList() {
    import('@vaadin/router').then(({Router}) => {
      Router.go(resolveAppPath('/employees'));
    });
  }

  render() {
    const isEditMode = !!this.employeeId;

    return html`
      <div class="container">
        <h1>
          ${isEditMode
            ? this.t('employeeForm.editTitle')
            : this.t('employeeForm.addTitle')}
        </h1>

        <div class="form-card">
          <form @submit="${this._handleSubmit}">
            <div class="form-grid">
              <!-- First Name -->
              <div class="form-group">
                <label>
                  ${this.t('employeeForm.firstName')}
                  <span class="required">*</span>
                </label>
                <input
                  type="text"
                  .value="${this.formData.firstName}"
                  @input="${(e) =>
                    this._handleInput('firstName', e.target.value)}"
                  class="${this.errors.firstName ? 'error' : ''}"
                />
                ${this.errors.firstName
                  ? html`<div class="error-message">
                      ${this.errors.firstName}
                    </div>`
                  : ''}
              </div>

              <!-- Last Name -->
              <div class="form-group">
                <label>
                  ${this.t('employeeForm.lastName')}
                  <span class="required">*</span>
                </label>
                <input
                  type="text"
                  .value="${this.formData.lastName}"
                  @input="${(e) =>
                    this._handleInput('lastName', e.target.value)}"
                  class="${this.errors.lastName ? 'error' : ''}"
                />
                ${this.errors.lastName
                  ? html`<div class="error-message">
                      ${this.errors.lastName}
                    </div>`
                  : ''}
              </div>

              <!-- Email -->
              <div class="form-group">
                <label>
                  ${this.t('employeeForm.email')}
                  <span class="required">*</span>
                </label>
                <input
                  type="email"
                  .value="${this.formData.email}"
                  @input="${(e) => this._handleInput('email', e.target.value)}"
                  class="${this.errors.email ? 'error' : ''}"
                />
                ${this.errors.email
                  ? html`<div class="error-message">${this.errors.email}</div>`
                  : ''}
              </div>

              <!-- Phone -->
              <div class="form-group">
                <label>
                  ${this.t('employeeForm.phone')}
                  <span class="required">*</span>
                </label>
                <input
                  type="tel"
                  .value="${this.formData.phone}"
                  @input="${(e) => this._handleInput('phone', e.target.value)}"
                  class="${this.errors.phone ? 'error' : ''}"
                />
                ${this.errors.phone
                  ? html`<div class="error-message">${this.errors.phone}</div>`
                  : ''}
              </div>

              <!-- Date of Birth -->
              <div class="form-group">
                <label>
                  ${this.t('employeeForm.dateOfBirth')}
                  <span class="required">*</span>
                </label>
                <input
                  type="date"
                  .value="${this.formData.dateOfBirth}"
                  @input="${(e) =>
                    this._handleInput('dateOfBirth', e.target.value)}"
                  class="${this.errors.dateOfBirth ? 'error' : ''}"
                />
                ${this.errors.dateOfBirth
                  ? html`<div class="error-message">
                      ${this.errors.dateOfBirth}
                    </div>`
                  : ''}
              </div>

              <!-- Date of Employment -->
              <div class="form-group">
                <label>
                  ${this.t('employeeForm.dateOfEmployment')}
                  <span class="required">*</span>
                </label>
                <input
                  type="date"
                  .value="${this.formData.dateOfEmployment}"
                  @input="${(e) =>
                    this._handleInput('dateOfEmployment', e.target.value)}"
                  class="${this.errors.dateOfEmployment ? 'error' : ''}"
                />
                ${this.errors.dateOfEmployment
                  ? html`<div class="error-message">
                      ${this.errors.dateOfEmployment}
                    </div>`
                  : ''}
              </div>

              <!-- Department -->
              <div class="form-group">
                <label>
                  ${this.t('employeeForm.department')}
                  <span class="required">*</span>
                </label>
                <select
                  .value="${this.formData.department}"
                  @change="${(e) =>
                    this._handleInput('department', e.target.value)}"
                  class="${this.errors.department ? 'error' : ''}"
                >
                  <option value="">
                    -- ${this.t('employeeForm.department')} --
                  </option>
                  <option value="Analytics">
                    ${this.t('departments.analytics')}
                  </option>
                  <option value="Tech">${this.t('departments.tech')}</option>
                </select>
                ${this.errors.department
                  ? html`<div class="error-message">
                      ${this.errors.department}
                    </div>`
                  : ''}
              </div>

              <!-- Position -->
              <div class="form-group">
                <label>
                  ${this.t('employeeForm.position')}
                  <span class="required">*</span>
                </label>
                <select
                  .value="${this.formData.position}"
                  @change="${(e) =>
                    this._handleInput('position', e.target.value)}"
                  class="${this.errors.position ? 'error' : ''}"
                >
                  <option value="">
                    -- ${this.t('employeeForm.position')} --
                  </option>
                  <option value="Junior">${this.t('positions.junior')}</option>
                  <option value="Medior">${this.t('positions.medior')}</option>
                  <option value="Senior">${this.t('positions.senior')}</option>
                </select>
                ${this.errors.position
                  ? html`<div class="error-message">
                      ${this.errors.position}
                    </div>`
                  : ''}
              </div>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="btn btn-secondary"
                @click="${this._handleCancel}"
              >
                ${this.t('employeeForm.cancel')}
              </button>
              <button type="submit" class="btn btn-primary">
                ${this.t('employeeForm.save')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <confirm-dialog></confirm-dialog>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
