import {LitElement, html, css} from 'lit';
import {LocalizeMixin} from '../utils/i18n.js';
import {Router} from '@vaadin/router';
import {resolveAppPath} from '../utils/base-path.js';

export class NotFoundView extends LocalizeMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: var(--spacing-2xl) var(--spacing-md);
        text-align: center;
      }

      h1 {
        font-size: var(--font-size-3xl);
        color: var(--color-primary);
        margin-bottom: var(--spacing-lg);
      }

      p {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-xl);
      }

      .back-button {
        display: inline-block;
        padding: var(--spacing-md) var(--spacing-xl);
        background-color: var(--color-primary);
        color: white;
        text-decoration: none;
        border-radius: var(--radius-md);
        font-weight: 500;
        transition: background-color var(--transition-fast);
      }

      .back-button:hover {
        background-color: var(--color-primary-dark);
      }

      .emoji {
        font-size: 5rem;
        margin-bottom: var(--spacing-lg);
      }
    `;
  }

  _navigate(e) {
    e.preventDefault();
    Router.go(resolveAppPath('/'));
  }

  render() {
    return html`
      <div class="container">
        <h1>${this.t('notFound.title')}</h1>
        <p>${this.t('notFound.message')}</p>
        <a
          href="${resolveAppPath('/')}"
          class="back-button"
          @click="${this._navigate}"
        >
          ${this.t('notFound.backHome')}
        </a>
      </div>
    `;
  }
}

customElements.define('not-found', NotFoundView);
