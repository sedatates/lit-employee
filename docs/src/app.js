import {LitElement, css, html} from 'lit';
import {initRouter} from './router/router.js';
import store from './store/store.js';
import {initLanguage} from './utils/i18n.js';

import './components/nav-menu.js';

export class App extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        min-height: 100vh;
      }

      main {
        min-height: calc(100vh - 60px);
      }

      #outlet {
        width: 100%;
      }
    `;
  }

  firstUpdated() {
    super.firstUpdated();

    initLanguage();

    store.initializeSampleData();

    initRouter(this.shadowRoot.querySelector('#outlet'));
  }

  render() {
    return html`
      <nav-menu></nav-menu>
      <main>
        <div id="outlet"></div>
      </main>
    `;
  }
}

customElements.define('app-index', App);
