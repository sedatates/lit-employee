import {LitElement, html, css} from 'lit';

export class MyElement extends LitElement {
  static properties = {
    name: {type: String},
    count: {type: Number},
  };

  constructor() {
    super();
    this.name = 'World';
    this.count = 0;
  }

  static styles = css`
    :host {
      padding-top: 16px;
      display: block;
      text-align: center;
    }

    button {
      font-size: 1em;
      line-height: 1.5;
      padding: 0.25em 1em;
    }
  `;

  _increment() {
    this.count += 1;
  }

  render() {
    return html`
      <h1>Hello, ${this.name}!</h1>
      <button part="button" @click=${this._increment}>Click Count: ${this.count}</button>
      <slot></slot>
    `;
  }
}

customElements.define('my-element', MyElement);
