let flip;

async function renderLibrary() {
    const books = await api.getBooks();
    const grid = document.getElementById('library-grid');
    grid.innerHTML = books.map(b => `
        <div class="card" onclick='openBook(${JSON.stringify(b)})'>
            <h3>${b.title}</h3>
            <p>${b.author}</p>
        </div>
    `).join('');
}

function openBook(book) {
    showPage('reader');
    const canvas = document.getElementById('book-canvas');
    canvas.innerHTML = book.pages.map(p => `<div class="page-content">${p}</div>`).join('');
    flip = new St.PageFlip(canvas, { width: 500, height: 700 });
    flip.loadFromHTML(document.querySelectorAll('.page-content'));
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

async function askAI() {
    const input = document.getElementById('chat-input');
    const box = document.getElementById('chat-messages');
    const response = await api.askAI(input.value);
    box.innerHTML += `<div><b>შენ:</b> ${input.value}</div>`;
    box.innerHTML += `<div><b>AI:</b> ${response.answer}</div>`;
    input.value = "";
}

const quill = new Quill('#editor', { theme: 'snow' });

function toggleChat() {
    const chat = document.getElementById('chat-box');
    chat.style.display = chat.style.display === 'none' ? 'flex' : 'none';
}

window.onload = renderLibrary;
