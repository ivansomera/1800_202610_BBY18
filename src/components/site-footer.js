class SiteFooter extends HTMLElement {
  connectedCallback() {
    const currentPage = window.location.pathname;

    this.innerHTML = `
      <footer class="bottom-nav">
        <a href="main.html" class="${currentPage.includes('main') ? 'active' : ''}">🏠</a>
        <a href="favorites.html" class="${currentPage.includes('favorites') ? 'active' : ''}">❤️</a>
        <a href="leaderboard.html" class="${currentPage.includes('leaderboard') ? 'active' : ''}">🏆</a>
        <a href="mission.html" class="${currentPage.includes('mission') ? 'active' : ''}">✔</a>
      </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);