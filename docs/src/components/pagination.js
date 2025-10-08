import {LitElement, html, css} from 'lit';

class Pagination extends LitElement {
  static properties = {
    currentPage: {type: Number},
    totalPages: {type: Number},
  };

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }

    .pagination {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    button {
      padding: 10px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      min-width: 36px;
      height: 36px;
      font-size: 14px;
    }

    button:hover:not(:disabled):not(.active) {
      background: #f0f0f0;
      border-color: #999;
    }

    button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    button.active {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
      font-weight: bold;
    }

    .chevron {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
    }

    .dots {
      padding: 0 8px;
      color: #666;
      user-select: none;
    }
  `;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 10;
  }

  _goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.dispatchEvent(
        new CustomEvent('page-changed', {
          detail: {page: this.currentPage},
        })
      );
    }
  }

  _getPageNumbers() {
    const pages = [];
    const current = this.currentPage;
    const total = this.totalPages;

    // Her zaman ilk sayfayı ekle
    pages.push(1);

    if (total <= 5) {
      // Toplam sayfa 5 veya daha azsa hepsini göster
      for (let i = 2; i < total; i++) {
        pages.push(i);
      }
    } else {
      // Mevcut sayfanın solunda ve sağında 2'şer sayfa göster
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      // Sol tarafta üç nokta gerekli mi?
      if (start > 2) {
        pages.push('...');
      }

      // Ortadaki sayfalar
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Sağ tarafta üç nokta gerekli mi?
      if (end < total - 1) {
        pages.push('...');
      }
    }

    // Her zaman son sayfayı ekle
    if (total > 1) {
      pages.push(total);
    }

    return pages;
  }

  render() {
    const pages = this._getPageNumbers();

    return html`
      <div class="pagination">
        <button
          @click=${() => this._goToPage(this.currentPage - 1)}
          ?disabled=${this.currentPage === 1}
          aria-label="Önceki sayfa"
        >
          <svg class="chevron" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        ${pages.map((page) =>
          page === '...'
            ? html`<span class="dots">...</span>`
            : html`
                <button
                  class=${page === this.currentPage ? 'active' : ''}
                  @click=${() => this._goToPage(page)}
                >
                  ${page}
                </button>
              `
        )}

        <button
          @click=${() => this._goToPage(this.currentPage + 1)}
          ?disabled=${this.currentPage === this.totalPages}
          aria-label="Sonraki sayfa"
        >
          <svg class="chevron" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;
  }
}

customElements.define('pagination-controls', Pagination);
