/* =========================
   CVA BULLETIN MINI APP
   Core Logic (Feed + Article)
   ========================= */

// Temporary mock data (will be replaced by WordPress REST API)
const articles = [
    {
        id: 1,
        title: "Celebrating Culture and Creativity",
        author: "Valentino Achak Deng",
        date: "2026-01-10",
        excerpt: "A reflection on creativity, identity, and expression at CVA.",
        content: `
            <p>Culture and creativity form the backbone of education at Cornerstones Vision Academy.</p>
            <p>This article explores how artistic expression shapes confidence, leadership, and belonging.</p>
        `
    },
    {
        id: 2,
        title: "Why Cornerstones Vision Academy?",
        author: "Valentino Achak Deng",
        date: "2026-01-12",
        excerpt: "Understanding the vision, values, and future of CVA.",
        content: `
            <p>Cornerstones Vision Academy was founded on the principle of holistic education.</p>
            <p>Our approach blends academics, character, and creativity.</p>
        `
    }
];

/* =========================
   UTILITIES
   ========================= */

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/* =========================
   FEED RENDER
   ========================= */

function renderFeed() {
    const container = document.getElementById("feed");
    if (!container) return;

    articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "article-card";

        card.innerHTML = `
            <h2>
                <a href="article.html?id=${article.id}" style="color:inherit;text-decoration:none;">
                    ${article.title}
                </a>
            </h2>
            <div class="article-meta">
                ${article.author} · ${article.date}
            </div>
            <p>${article.excerpt}</p>
        `;

        container.appendChild(card);
    });
}

/* =========================
   SINGLE ARTICLE RENDER
   ========================= */

function renderArticle() {
    const container = document.getElementById("article-content");
    if (!container) return;

    const articleId = parseInt(getQueryParam("id"), 10);
    const article = articles.find(a => a.id === articleId);

    if (!article) {
        container.innerHTML = "<p>Article not found.</p>";
        return;
    }

    container.innerHTML = `
        <article class="article-full">
            <h2>${article.title}</h2>
            <div class="article-meta">
                ${article.author} · ${article.date}
            </div>
            ${article.content}
        </article>
    `;
}

/* =========================
   INIT
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    renderFeed();
    renderArticle();
});
