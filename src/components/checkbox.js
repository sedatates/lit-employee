import {LitElement, html, css} from 'lit';

export class Checkbox extends LitElement {
  static get styles() {
    return css``;
  }

  static get properties() {
    return {
      isChecked: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.isChecked = false;
  }

  _handleCheckboxChange() {
    this.isChecked = !this.isChecked;
    this.dispatchEvent(
      new CustomEvent('change', {detail: {checked: this.isChecked}})
    );
  }

  render() {
    return html`
      <input
        type="checkbox"
        .checked="${this.isChecked}"
        @change="${this._handleCheckboxChange}"
      />
    `;
  }
}

customElements.define('checkbox-element', Checkbox);
