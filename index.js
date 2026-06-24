//api: https://emojihub.yurace.pro/api/all
// "https://emojihub.yurace.pro/api/search?q=heart"

const emojiListEl = document.querySelector(".emoji__list");
const name = localStorage.getItem("name");
const API_BASE_URL = "https://emojihub.yurace.pro/api/all";
const searchInput = document.getElementById("search");
const resultsList = document.getElementById("results");
const errorMsg = document.getElementById("error");
let emojiNames = [];
let sortingList = [];

async function fetchEmoji(event) {
    const query = event.target.value;
    const response = await fetch(
        `https://emojihub.yurace.pro/api/search?q=${query}`,
    );
    const data = await response.json();
    if (!data.length > 0) {
        return emojiListEl.innerHTML = `<p>No emoji results for: ${query}</p`;
    }
    emojiListEl.innerHTML = data.map((emoji) => emojiHTML(emoji)).join("");
}

function onSearchChange(event) {
  function renderResults(items) {
    resultsList.innerHTML = "";
    if (!items || items.length === 0) {
      resultsList.innerHTML = "<li>No results found</li>";
      return;
    }
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.name || JSON.stringify(item);
      resultsList.appendChild(li);
    });
  }

  async function fetchResults(query) {
    try {
      errorMsg.textContent = "";
      resultsList.innerHTML = "<li>Loading...</li>";

      const response = await fetch(
        `${API_BASE_URL}?q=${encodeURIComponent(query)}`,
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      renderResults(data.results || data);
    } catch (err) {
      resultsList.innerHTML = "";
      errorMsg.textContent = `Error: ${err.message}`;
    }
  }

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

async function renderEmoji(filter) {
    const emoji = await fetch(`https://emojihub.yurace.pro/api/all`);
    const emojiData = await emoji.json();
    
    let sortingList = [...emojiData];

    if (filter === "A_TO_Z") {
        sortingList.sort((a, b) => a.name.localeCompare(b.name));
    } 
    else if (filter === "Z_TO_A") {
        sortingList.sort((a, b) => b.name.localeCompare(a.name));
    }

    emojiListEl.innerHTML = sortingList
        .map((emoji) => emojiHTML(emoji))
        .join("");
}

function filterEmojis(event) {
    renderEmoji(event.target.value);
}

function emojiHTML(emoji) {
    return `
        <div class="emoji">
        <h3>${emoji.htmlCode}</h3>
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

setTimeout(() => {
    renderEmoji();
});

