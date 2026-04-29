let activeFlip = null;

const libraryData = [
    {
        id: 1, title: "ვეფხისტყაოსანი", author: "შოთა რუსთაველი", subject: "ქართული",
        pages: [
            "იყო არაბეთს როსტევან, მეფე ღმრთისაგან სვიანი, მაღალი, უხვი, მდაბალი...",
            "სხვა ძე არ ესვა მეფესა, მართ ოდენ ასული ერთი, სოფლისა მნათი მნათობი...",
            "ნახეს უცხო ვინმე მოყმე მტირალი, ჯდა შავსა ცხენსა, ეცვა ვეფხის ტყავი..."
        ],
        quiz: [{ q: "ვინ იყო არაბეთის მეფე?", a: ["როსტევანი", "ტარიელი"], correct: 0 }]
    }
];

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if (id === 'library') renderLibrary();
}

function renderLibrary(data = libraryData) {
    const list = document.getElementById('library-list');
    list.innerHTML = data.map(b => `
        <div class="course-card glass" onclick="openBook(${b.id})">
            <h3>${b.title}</h3>
            <p>ავტორი: ${b.author}</p>
            <p>საგანი: ${b.subject}</p>
            <button class="action-btn">წაკითხვა</button>
        </div>
    `).join('');
}

function filterLibrary() {
    const txt = document.getElementById('lib-search').value.toLowerCase();
    const sub = document.getElementById('subject-filter').value;
    const filtered = libraryData.filter(b => 
        (b.title.toLowerCase().includes(txt) || b.author.toLowerCase().includes(txt)) &&
        (sub === 'all' || b.subject === sub)
    );
    renderLibrary(filtered);
}

function openBook(id) {
    const book = libraryData.find(b => b.id === id);
    showPage('book-reader');
    document.getElementById('current-book-title').innerText = book.title;
    
    const canvas = document.getElementById('book-canvas');
    canvas.innerHTML = book.pages.map((p, i) => `
        <div class="page-content">
            <p>${p}</p>
            <div class="page-num">გვერდი ${i+1}</div>
        </div>
    `).join('');

    if (activeFlip) activeFlip.destroy();
    activeFlip = new St.PageFlip(canvas, { width: 500, height: 700, showCover: true });
    activeFlip.loadFromHTML(document.querySelectorAll('.page-content'));

    activeFlip.on('flip', (e) => {
        if (e.data === book.pages.length - 1) document.getElementById('book-quiz').style.display = 'block';
    });
}

function handleAuth() {
    const email = document.getElementById('email').value;
    if (email) {
        localStorage.setItem('user', JSON.stringify({ email, role: 'student' }));
        location.reload();
    }
}

function logout() { localStorage.clear(); location.reload(); }

// საწყისი ჩატვირთვა
window.onload = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('login-nav-btn').style.display = 'none';
        document.getElementById('logout-nav-btn').style.display = 'block';
    }
    showPage('home');
};
