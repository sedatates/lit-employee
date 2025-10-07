import {LitElement, html, css} from 'lit';
import {LocalizeMixin, setLanguage, getCurrentLanguage} from '../utils/i18n.js';
import './icons.js';

import {Router} from '@vaadin/router';

export class NavMenu extends LocalizeMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      nav {
        background-color: var(--color-primary);
        color: white;
        padding: 0;
        box-shadow: var(--shadow-md);
      }

      .nav-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 var(--spacing-md);
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
      }

      .nav-brand {
        font-size: var(--font-size-xl);
        font-weight: 700;
        color: white;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .nav-links {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
      }

      .nav-links a {
        color: white;
        text-decoration: none;
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        transition: background-color var(--transition-fast);
        font-weight: 500;
      }

      .nav-links a:hover {
        background-color: var(--color-primary-dark);
      }

      .nav-links a.active {
        background-color: var(--color-primary-dark);
      }

      .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: var(--font-size-2xl);
        cursor: pointer;
        padding: var(--spacing-sm);
      }

      .mobile-menu {
        display: none;
        flex-direction: column;
        align-items: flex-end;
        background-color: var(--color-primary);
        padding: var(--spacing-md);
        gap: var(--spacing-sm);
      }

      .mobile-menu.open {
        display: flex;
        animation: slideIn 0.3s ease-in-out;
      }

      .mobile-menu a {
        color: white;
        text-decoration: none;
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        transition: background-color var(--transition-fast);
      }

      .mobile-menu a:hover {
        background-color: var(--color-primary-dark);
      }

      .navlink-inner {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      @media (max-width: 768px) {
        .nav-links {
          display: none;
        }

        .mobile-menu-btn {
          display: block;
        }
      }
    `;
  }

  static get properties() {
    return {
      mobileMenuOpen: {type: Boolean},
    };
  }

  _changeLanguage() {
    const currentLang = getCurrentLanguage();
    const lang = currentLang === 'en' ? 'tr' : 'en';
    setLanguage(lang);
  }

  constructor() {
    super();
    this.mobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  navigate(e, path) {
    e.preventDefault();
    this.mobileMenuOpen = false;
    Router.go(path);
  }

  render() {
    return html`
      <nav>
        <div class="nav-container">
          <a
            alt="Logo"
            class="nav-brand"
            @click="${(e) => this.navigate(e, '/')}"
          >
            <icon-element name="cat" size="32" color="white"></icon-element>
          </a>

          <!-- Desktop Menu -->

          <div class="nav-links">
            <a
              href="/employees"
              @click="${(e) => this.navigate(e, '/employees')}"
            >
              <div class="navlink-inner">
                <icon-element
                  name="employee"
                  size="24"
                  color="white"
                ></icon-element>
                <span>${this.t('nav.employees')}</span>
              </div>
            </a>
            <a
              href="/employees/new"
              @click="${(e) => this.navigate(e, '/employees/new')}"
            >
              <div class="navlink-inner">
                <icon-element
                  name="employee-add"
                  size="24"
                  color="white"
                ></icon-element>
                <span>${this.t('nav.addEmployee')}</span>
              </div>
            </a>

            <!-- Language Switcher -->
            <icon-element
              name=${getCurrentLanguage() === 'en' ? 'flag-EN' : 'flag-TR'}
              size="24"
              color="white"
              @click="${() => this._changeLanguage()}"
            ></icon-element>
          </div>

          <!-- Mobile Menu Button -->
          <button class="mobile-menu-btn" @click="${this.toggleMobileMenu}">
            <icon-element
              name="${this.mobileMenuOpen ? 'close' : 'menu'}"
              size="24"
              color="white"
            ></icon-element>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div class="mobile-menu ${this.mobileMenuOpen ? 'open' : ''}">
          <a
            href="/employees"
            @click="${(e) => this.navigate(e, '/employees')}"
          >
            <div class="navlink-inner">
              <icon-element
                name="employee"
                size="24"
                color="white"
              ></icon-element>
              <span>${this.t('nav.employees')}</span>
            </div>
          </a>
          <a
            href="/employees/new"
            @click="${(e) => this.navigate(e, '/employees/new')}"
          >
            <div class="navlink-inner">
              <icon-element
                name="employee-add"
                size="24"
                color="white"
              ></icon-element>
              <span>${this.t('nav.addEmployee')}</span>
            </div>
          </a>

          <!-- Language Switcher -->
          <icon-element
            name=${getCurrentLanguage() === 'en' ? 'flag-EN' : 'flag-TR'}
            size="24"
            color="white"
            @click="${() => this._changeLanguage()}"
          ></icon-element>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-menu', NavMenu);
