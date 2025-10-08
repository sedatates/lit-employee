import {MyElement} from '../my-element.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../src/components/nav-menu.js';
import {
  initLanguage,
  setLanguage,
  getCurrentLanguage,
} from '../src/utils/i18n.js';

const waitForUpdate = async (element) => {
  await element.updateComplete;
  // Ensure any queued microtasks from event listeners also settle
  await Promise.resolve();
};

suite('change language', () => {
  setup(() => {
    document.documentElement.lang = 'en';
    initLanguage();
    setLanguage('en');
  });

  teardown(() => {
    setLanguage('en');
    document.documentElement.lang = 'en';
  });

  test('nav menu toggles translations and flag icon', async () => {
    assert.ok(MyElement);
    const navMenu = await fixture(html`<nav-menu></nav-menu>`);
    await waitForUpdate(navMenu);

    const getLanguageIcon = () =>
      navMenu.shadowRoot.querySelector('.nav-links > icon-element');

    const getEmployeesLabel = () =>
      navMenu.shadowRoot
        .querySelector('.nav-links a:first-of-type span')
        .textContent.trim();

    assert.equal(getLanguageIcon().getAttribute('name'), 'flag-EN');
    assert.equal(getEmployeesLabel(), 'Employees');
    assert.equal(getCurrentLanguage(), 'en');
    assert.equal(document.documentElement.lang, 'en');

    navMenu._changeLanguage();
    await waitForUpdate(navMenu);

    assert.equal(getLanguageIcon().getAttribute('name'), 'flag-TR');
    assert.equal(getEmployeesLabel(), 'Çalışanlar');
    assert.equal(getCurrentLanguage(), 'tr');
    assert.equal(document.documentElement.lang, 'tr');
  });
});
