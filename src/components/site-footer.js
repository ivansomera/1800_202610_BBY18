class SiteFooter extends HTMLElement {
  connectedCallback() {
    const currentPage = window.location.pathname;

    this.innerHTML = `
      <footer class="bottom-nav">

        <a href="main.html" class="${currentPage.includes('main') ? 'active' : ''}">
          <i class="bi bi-house"></i>
        </a>

        <a href="favorites.html" class="${currentPage.includes('favorites') ? 'active' : ''}">
          <i class="bi bi-heart"></i>
        </a>

        <a href="leaderboard.html" class="${currentPage.includes('leaderboard') ? 'active' : ''}">
          <i class="bi bi-trophy"></i>
        </a>

        <a href="mission.html" class="${currentPage.includes('mission') ? 'active' : ''}">
          <i class="bi bi-check-circle"></i>
        </a>

      </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);