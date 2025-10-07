import {en} from '../locales/en.js';
import {tr} from '../locales/tr.js';

const translations = {
  en,
  tr,
};

let currentLang = 'en';

export function initLanguage() {
  const htmlLang = document.documentElement.lang || 'en';
  currentLang = translations[htmlLang] ? htmlLang : 'en';
  return currentLang;
}

export function getCurrentLanguage() {
  return currentLang;
}

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('language-changed', {detail: {lang}}));
  }
}

export function t(keyPath) {
  const keys = keyPath.split('.');
  let result = translations[currentLang];

  for (const key of keys) {
    if (result && typeof result === 'object') {
      result = result[key];
    } else {
      console.warn(`Translation key not found: ${keyPath}`);
      return keyPath;
    }
  }

  return result || keyPath;
}

export const LocalizeMixin = (superClass) =>
  class extends superClass {
    constructor() {
      super();
      this._currentLang = getCurrentLanguage();
      this._onLanguageChanged = this._onLanguageChanged.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      window.addEventListener('language-changed', this._onLanguageChanged);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      window.removeEventListener('language-changed', this._onLanguageChanged);
    }

    _onLanguageChanged(event) {
      this._currentLang = event.detail.lang;
      // Sayfayı yeniden render etmek için requestUpdate çağrısı çünkü property değişmiyor.
      this.requestUpdate();
    }

    t(key) {
      return t(key);
    }
  };
