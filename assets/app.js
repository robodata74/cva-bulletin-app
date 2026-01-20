/* =========================================================
   CVA BULLETIN MINI APP
   Full Client Logic (Feed, Article, Likes, Comments)
   ========================================================= */

/* =========================
   CONFIG (FUTURE GATES)
   ========================= */

const CONFIG = {
    commentsEnabled: true,   // can be gated later
    likesEnabled: true,      // can be gated later
    requireMembership: false // flip to true when ready
};

/* =========================
   MOCK DATA (REPLACE WITH API)
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
   UTILITIES
   ========================= */

function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

/* =========================
   LIKES SYSTEM
   ========================= */

function getLikes() {
    return JSON.parse(localStorage.getItem("cva_likes")) || {};
}

function saveLikes(likes) {
    localStorage.setItem("cva_likes", JSON.stringify(likes));
}

function toggleLike(articleId) {
    if (!CONFIG.likesEnabled) return;
    const likes = getLikes();
    likes[articleId] = (likes[articleId] || 0) + 1;
    saveLikes(likes);
    renderArticle();
}

/* =========================
   COMMENTS SYSTEM
   ========================= */

function getComments() {
    return JSON.parse(localStorage.getItem("cva_comments")) || {};
}

function saveComments(comments) {
    localStorage.setItem("cva_comments", JSON.stringify(comments));
}

function addComment(articleId, name, text) {
    if (!CONFIG.commentsEnabled) return;

    const comments = getComments();
    if (!comments[articleId]) comments[articleId] = [];

    comments[articleId].push({
        name: name.trim(),
        text: text.trim(),
        date: new Date().toISOString()
    });

    saveComments(comments);
    renderArticle();
}

/* =========================
   FEED RENDER
   ========================= */

function renderFeed() {
    const feed = document.getElementById("feed");
    if (!feed) return;

    articles.forEach(article => {
        const card = document.createElement("article");
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

        feed.appendChild(card);
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

    const likes = getLikes();
    const likeCount = likes[article.id] || 0;
    const comments = getComments()[article.id] || [];

    container.innerHTML = `
        <article class="article-full">
            <h2>${article.title}</h2>

            <div class="article-meta">
                ${article.author} · ${article.date}
            </div>

            ${article.image ? `<img src="${article.image}" alt="${article.title}" style="width:100%;margin:1.5rem 0;border-radius:8px;">` : ""}

            ${CONFIG.likesEnabled ? `
                <button onclick="toggleLike(${article.id})"
                        style="margin-bottom:1rem;padding:0.5rem 1rem;">
                    👍 Like (${likeCount})
                </button>
            ` : ""}

            ${article.content}

            ${CONFIG.commentsEnabled ? `
                <section style="margin-top:3rem;">
                    <h3>Comments</h3>

                    <form onsubmit="
                        event.preventDefault();
                        addComment(
                            ${article.id},
                            this.name.value,
                            this.comment.value
                        );
                        this.reset();
                    ">
                        <input required name="name" placeholder="Your name"
                               style="width:100%;padding:0.5rem;margin-bottom:0.5rem;">
                        <textarea required name="comment" placeholder="Write a comment"
                                  style="width:100%;padding:0.5rem;"></textarea>
                        <button type="submit" style="margin-top:0.5rem;">
                            Post Comment
                        </button>
                    </form>

                    <div style="margin-top:1.5rem;">
                        ${comments.map(c => `
                            <div style="margin-bottom:1rem;border-bottom:1px solid #1f2933;padding-bottom:0.5rem;">
                                <strong>${c.name}</strong>
                                <div style="font-size:0.75rem;color:#9ca3af;">
                                    ${new Date(c.date).toLocaleString()}
                                </div>
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
   INIT
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    renderFeed();
    renderArticle();
});
