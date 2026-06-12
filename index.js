//api: https://emojihub.yurace.pro/api/all

const emojiListEl = document.querySelector(".emoji__list");
const name = localStorage.getItem("name");

async function onSearchChange(event) {
    const name = event.target.value;
    renderEmoji(name);
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