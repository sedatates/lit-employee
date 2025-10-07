import {LitElement, html, css} from 'lit';
import {LocalizeMixin} from '../utils/i18n.js';
import './icons.js';

export class ConfirmDialog extends LocalizeMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: none;
      }

      :host([open]) {
        display: block;
      }

      .modal-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: var(--z-modal);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        animation: fadeIn 0.2s ease-in-out;
      }

      .dialog {
        position: relative;
        z-index: 1;
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        max-width: 500px;
        width: 90%;
        padding: var(--spacing-xl);
        animation: slideIn 0.3s ease-out;
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
      }

      .dialog-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-size-2xl);
        flex-shrink: 0;
      }

      .dialog-icon.warning {
        background-color: #fef3c7;
        color: var(--color-warning);
      }

      .dialog-icon.danger {
        background-color: #fee2e2;
        color: var(--color-danger);
      }

      .dialog-icon.info {
        background-color: #dbeafe;
        color: var(--color-info);
      }

      .dialog-title {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--color-text);
        margin: 0;
      }

      .dialog-body {
        margin-bottom: var(--spacing-xl);
      }

      .dialog-message {
        font-size: var(--font-size-base);
        color: var(--color-text-secondary);
        line-height: 1.6;
        white-space: pre-line;
      }

      .dialog-footer {
        display: flex;
        gap: var(--spacing-md);
        justify-content: flex-end;
      }

      .btn {
        padding: var(--spacing-sm) var(--spacing-xl);
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: var(--font-size-base);
        font-weight: 500;
        transition: all var(--transition-fast);
      }

      .btn-cancel {
        background-color: var(--color-gray-200);
        color: var(--color-text);
      }

      .btn-cancel:hover {
        background-color: var(--color-gray-300);
      }

      .btn-confirm {
        background-color: var(--color-danger);
        color: white;
      }

      .btn-confirm:hover {
        background-color: #dc2626;
      }

      .btn-confirm.primary {
        background-color: var(--color-primary);
      }

      .btn-confirm.primary:hover {
        background-color: var(--color-primary-dark);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      /* Responsive */
      @media (max-width: 768px) {
        .dialog {
          width: 95%;
          padding: var(--spacing-lg);
        }

        .dialog-footer {
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
      open: {type: Boolean, reflect: true},
      title: {type: String},
      message: {type: String},
      confirmText: {type: String},
      cancelText: {type: String},
      type: {type: String},
      confirmButtonType: {type: String},
    };
  }

  constructor() {
    super();
    this.open = false;
    this.title = '';
    this.message = '';
    this.confirmText = '';
    this.cancelText = '';
    this.type = 'warning';
    this.confirmButtonType = 'danger';
    this._resolvePromise = null;
  }

  show({
    title,
    message,
    confirmText,
    cancelText,
    type = 'warning',
    confirmButtonType = 'danger',
  }) {
    this.title = title;
    this.message = message;
    this.confirmText = confirmText;
    this.cancelText = cancelText;
    this.type = type;
    this.confirmButtonType = confirmButtonType;
    this.open = true;
    return new Promise((resolve) => {
      this._resolvePromise = resolve;
    });
  }

  hide() {
    this.open = false;
  }

  _handleConfirm() {
    this.hide();
    if (this._resolvePromise) {
      this._resolvePromise(true);
      this._resolvePromise = null;
    }
  }

  _handleCancel() {
    this.hide();
    if (this._resolvePromise) {
      this._resolvePromise(false);
      this._resolvePromise = null;
    }
  }

  _handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      this._handleCancel();
    }
  }

  _getIcon() {
    switch (this.type) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '⚡';
      case 'info':
        return 'ℹ️';
      default:
        return '⚠️';
    }
  }

  render() {
    return html`
      <div class="modal-container">
        <div class="overlay" @click="${this._handleOverlayClick}"></div>
        <div class="dialog" @click="${(e) => e.preventDefault()}">
          <div class="dialog-header">
            <icon-element
              class="dialog-icon ${this.type}"
              name="${this.type === 'danger' ? 'delete' : 'info'}"
              size="32"
              color="${this.type === 'danger'
                ? 'var(--color-danger)'
                : this.type === 'warning'
                ? 'var(--color-warning)'
                : 'var(--color-info)'}"
            ></icon-element>
            <h2 class="dialog-title">${this.title}</h2>
          </div>

          <div class="dialog-body">
            <p class="dialog-message">${this.message}</p>
          </div>

          <div class="dialog-footer">
            <button class="btn btn-cancel" @click="${this._handleCancel}">
              ${this.cancelText}
            </button>
            <button
              class="btn btn-confirm ${this.confirmButtonType}"
              @click="${this._handleConfirm}"
            >
              ${this.confirmText}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirm-dialog', ConfirmDialog);
