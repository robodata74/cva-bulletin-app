/* =========================================================
   CVA BULLETIN MINI APP
   Full Client Logic (Feed, Article, Likes, Comments)
   Author: Cornerstones Vision Academy
   Year: 2026
   ========================================================= */

/* =========================
   CONFIGURATION
   ========================= */
const CONFIG = {
    commentsEnabled: true,
    likesEnabled: true,
    requireMembership: false
};

/* =========================
   MOCK DATA
   ========================= */
const articles = [
    {
        id: 1,
        title: "Celebrating Culture and Creativity",
        author: "Valentino Achak Deng",
        date: "2026-01-10",
        excerpt: "A reflection on creativity, identity, and expression at CVA.",
        image: "assets/images/culture-creativity.jpg",
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
        image: "assets/images/why-cva.jpg",
        content: `
            <p>Cornerstones Vision Academy was founded on the principle of holistic education.</p>
            <p>Our approach blends academics, character, and creativity.</p>
        `
    }
];

/* =========================
   UTILITY FUNCTIONS
   ========================= */
const utils = {
    getQueryParam: (param) => new URLSearchParams(window.location.search).get(param),
    formatDate: (isoString) => new Date(isoString).toLocaleString()
};

/* =========================
   LOCAL STORAGE HANDLERS
   ========================= */
const storage = {
    getLikes: () => JSON.parse(localStorage.getItem("cva_likes")) || {},
    saveLikes: (likes) => localStorage.setItem("cva_likes", JSON.stringify(likes)),
    getComments: () => JSON.parse(localStorage.getItem("cva_comments")) || {},
    saveComments: (comments) => localStorage.setItem("cva_comments", JSON.stringify(comments))
};

/* =========================
   LIKE SYSTEM
   ========================= */
function toggleLike(articleId) {
    if (!CONFIG.likesEnabled) return;

    const likes = storage.getLikes();
    likes[articleId] = (likes[articleId] || 0) + 1;
    storage.saveLikes(likes);

    renderArticle();
}

/* =========================
   COMMENT SYSTEM
   ========================= */
function addComment(articleId, name, text) {
    if (!CONFIG.commentsEnabled) return;

    const comments = storage.getComments();
    if (!comments[articleId]) comments[articleId] = [];

    comments[articleId].push({
        name: name.trim(),
        text: text.trim(),
        date: new Date().toISOString()
    });

    storage.saveComments(comments);
    renderArticle();
}

/* =========================
   FEED RENDERING
   ========================= */
function renderFeed() {
    const feedContainer = document.getElementById("feed");
    if (!feedContainer) return;

    feedContainer.innerHTML = "";

    articles.forEach(article => {
        const card = document.createElement("article");
        card.className = "article-card";

        card.innerHTML = `
            ${article.image ? `<img src="${article.image}" alt="${article.title}" style="width:100%;max-height:200px;object-fit:cover;border-radius:8px;margin-bottom:1rem;">` : ""}
            <h2>
                <a href="article.html?id=${article.id}" style="color:inherit;text-decoration:none;">
                    ${article.title}
                </a>
            </h2>
            <div class="article-meta">${article.author} · ${article.date}</div>
            <p>${article.excerpt}</p>
        `;

        feedContainer.appendChild(card);
    });
}

/* =========================
   SINGLE ARTICLE RENDERING
   ========================= */
function renderArticle() {
    const container = document.getElementById("article-content");
    if (!container) return;

    const articleId = parseInt(utils.getQueryParam("id"), 10);
    const article = articles.find(a => a.id === articleId);

    if (!article) {
        container.innerHTML = "<p>Article not found.</p>";
        return;
    }

    const likes = storage.getLikes();
    const likeCount = likes[article.id] || 0;
    const comments = storage.getComments()[article.id] || [];

    container.innerHTML = `
        <article class="article-full">
            <h2>${article.title}</h2>
            <div class="article-meta">${article.author} · ${article.date}</div>
            ${article.image ? `<img src="${article.image}" alt="${article.title}">` : ""}
            ${CONFIG.likesEnabled ? `<button onclick="toggleLike(${article.id})" class="btn">👍 Like (${likeCount})</button>` : ""}
            ${article.content}
            ${CONFIG.commentsEnabled ? `
                <section style="margin-top:3rem;">
                    <h3>Comments</h3>
                    <form onsubmit="
                        event.preventDefault();
                        addComment(${article.id}, this.name.value, this.comment.value);
                        this.reset();
                    ">
                        <input required name="name" placeholder="Your name" style="width:100%;padding:0.5rem;margin-bottom:0.5rem;">
                        <textarea required name="comment" placeholder="Write a comment" style="width:100%;padding:0.5rem;"></textarea>
                        <button type="submit" class="btn" style="margin-top:0.5rem;">Post Comment</button>
                    </form>
                    <div style="margin-top:1.5rem;">
                        ${comments.map(c => `
                            <div style="margin-bottom:1rem;border-bottom:1px solid #1f2933;padding-bottom:0.5rem;">
                                <strong>${c.name}</strong>
                                <div style="font-size:0.75rem;color:#9ca3af;">${utils.formatDate(c.date)}</div>
                                <p>${c.text}</p>
                            </div>
                        `).join("")}
                    </div>
                </section>
            ` : ""}
        </article>
    `;
}

/* =========================
   ADD DUMMY ARTICLE BUTTON
   ========================= */
document.getElementById("add-article-btn")?.addEventListener("click", () => {
    const newId = articles.length + 1;
    articles.push({
        id: newId,
        title: `New Dummy Article ${newId}`,
        author: "Admin",
        date: new Date().toISOString().split("T")[0],
        excerpt: "This is a placeholder excerpt for a new article.",
        image: "assets/images/culture-creativity.jpg",
        content: `<p>This is dummy content for the new article.</p>`
    });
    renderFeed();
});

/* =========================
   INITIALIZATION
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
    renderFeed();
    renderArticle();
});
