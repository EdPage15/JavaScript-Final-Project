//api: https://emojihub.yurace.pro/api/all

const emojiListEl = document.querySelector(".emoji__list");
const name = localStorage.getItem("name");

function onSearchChange(event) {
    // ===== CONFIGURATION =====
    const API_BASE_URL = "https://emojihub.yurace.pro/api/all"; // Replace with your API endpoint

    // ===== DOM ELEMENTS =====
    const searchInput = document.getElementById("search");
    const resultsList = document.getElementById("results");
    const errorMsg = document.getElementById("error");

    // ===== HELPER: Render results =====
    function renderResults(items) {
        resultsList.innerHTML = "";
        if (!items || items.length === 0) {
            resultsList.innerHTML = "<li>No results found</li>";
            return;
        }
        items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item.name || JSON.stringify(item);
            resultsList.appendChild(li);
        });
    }

    // ===== HELPER: Fetch from API =====
    async function fetchResults(query) {
        try {
            errorMsg.textContent = "";
            resultsList.innerHTML = "<li>Loading...</li>";

            const response = await fetch(`${API_BASE_URL}?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            renderResults(data.results || data); // Adjust based on your API's JSON structure
        } catch (err) {
            resultsList.innerHTML = "";
            errorMsg.textContent = `Error: ${err.message}`;
        }
    }

    // ===== EVENT: Search as you type (debounced) =====
    let debounceTimer;
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        clearTimeout(debounceTimer);
        if (query.length < 2) {
            resultsList.innerHTML = "";
            return;
        }
        debounceTimer = setTimeout(() => fetchResults(query), 300);
    });
}



async function renderEmoji(name) {
    const emoji = await fetch(`https://emojihub.yurace.pro/api/all`);
    const emojiData = await emoji.json();
    emojiListEl.innerHTML = emojiData.map(emoji => emojiHTML(emoji)).join("");

    if (filter === "Alphabetical A to Z") {
            name.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    }
    else if (filter === "Alphabetical Z to A") {
            name.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
    }
    // else if (filter === "") {
    //     emojiData.sort((a, b) => b. - a.);
    // }
    // else if (filter === "") {
    //     emojiData.sort((a, b) => b. - a.);
    // }


}

function emojiHTML(emoji) {
    return `
        <div class="emoji">
            <div class="emoji__name">
                ${emoji.name}
            </div>
            <p class="emoji__category">
                ${emoji.category}
            </p>
            <p class="emoji__group">
                ${emoji.group}
            </p>
        </div>`;
}

renderEmoji(name);

function filterEmojis(event) {
    renderEmoji(event.target.value);
}

setTimeout(() => {
    renderEmoji();
});