// js/app.js - სრული ლოგიკა Deep Space Academy LMS

let currentUser = null;

// ==================== მომხმარებლები ====================
const users = [
  { id: 1, email: "student@lms.ge", password: "student123", role: "student", username: "სტუდენტი" },
  { id: 2, email: "admin@lms.ge", password: "admin123", role: "admin", username: "ადმინისტრატორი" },
  { id: 3, email: "teacher@lms.ge", password: "teacher123", role: "teacher", username: "მასწავლებელი" }
];

// ==================== წიგნების მონაცემთა ბაზა ====================
const booksDatabase = [
  {
    id: 1,
    title: "ვეფხისტყაოსანი",
    author: "შოთა რუსთაველი",
    genre: "პოეზია",
    description: "ქართული ლიტერატურის უდიდესი ეპიკური პოემა.",
    cover: "https://via.placeholder.com/300x420/1a1a2e/64b5ff?text=ვეფხისტყაოსანი",
    chapters: [
      { title: "დასაწყისი", text: "რომელმან შექმნა სამყარო ძალითა მით ძლიერითა..." },
      { title: "როსტევან მეფის ამბავი", text: "იყო არაბეთს როსტევან, მეფე სახელოვანი..." },
      { title: "ტარიელის ამბავი", text: "ტარიელი ვეფხისტყაოსანი იყო..." },
      { title: "დასასრული", text: "სამივე გმირი ერთად იზეიმეს გამარჯვება..." }
    ]
  },
  {
    id: 2,
    title: "ოთარაანთ ქვრივი",
    author: "ილია ჭავჭავაძე",
    genre: "მხატვრული",
    description: "კლასიკური მოთხრობა სოციალურ უთანასწორობაზე.",
    cover: "https://via.placeholder.com/300x420/1a1a2e/64b5ff?text=ოთარაანთ+ქვრივი",
    chapters: [
      { title: "თავი 1", text: "სოფელში ყველამ იცოდა, ვინ იყო ოთარაანთ ქვრივი..." }
    ]
  },
  {
    id: 3,
    title: "კაცია - ადამიანი?!",
    author: "ილია ჭავჭავაძე",
    genre: "მხატვრული",
    description: "სატირული ნაწარმოები თავადაზნაურობის ნაკლოვანებებზე.",
    cover: "https://via.placeholder.com/300x420/1a1a2e/64b5ff?text=კაცია+ადამიანი",
    chapters: [{ title: "შესავალი", text: "ლუარსაბ თათქარიძე — კარგად ჩასუქებული თავადი..." }]
  },
  {
    id: 4,
    title: "ჯაყოს ხიზნები",
    author: "მიხეილ ჯავახიშვილი",
    genre: "მხატვრული",
    description: "XX საუკუნის დასაწყისის საქართველოს ამსახველი რომანი.",
    cover: "https://via.placeholder.com/300x420/1a1a2e/64b5ff?text=ჯაყოს+ხიზნები",
    chapters: [{ title: "თავი 1", text: "ჯაყო და მისი თავგადასავალი..." }]
  },
  {
    id: 5,
    title: "Python პროგრამირება დამწყებთათვის",
    author: "გიორგი მაისურაძე",
    genre: "ტექნიკური",
    description: "პრაქტიკული სახელმძღვანელო Python-ის შესწავლისთვის.",
    cover: "https://via.placeholder.com/300x420/1a1a2e/64b5ff?text=Python",
    chapters: [
      { title: "შესავალი Python-ში", text: "Python არის მარტივი და ძლიერი პროგრამირების ენა..." }
    ]
  }
];

// ==================== ლიტერატურის ისტორია ====================
const literatureHistory = [
  {
    period: "ძველი ქართული ლიტერატურა (V-XVIII ს.)",
    description: "სასულიერო და საერო ლიტერატურის ჩამოყალიბება",
    key_figures: "იაკობ ცურტაველი, შოთა რუსთაველი, სულხან-საბა ორბელიანი",
    works: "ვეფხისტყაოსანი, წამება წმიდისა შუშანიკისი"
  },
  {
    period: "ახალი ქართული ლიტერატურა (XIX ს.)",
    description: "რომანტიზმიდან რეალიზმამდე",
    key_figures: "ილია ჭავჭავაძე, აკაკი წერეთელი, ვაჟა-ფშაველა",
    works: "ოთარაანთ ქვრივი, კაცია — ადამიანი?!"
  },
  {
    period: "XX საუკუნის ქართული ლიტერატურა",
    description: "მოდერნიზმი და საბჭოთა პერიოდი",
    key_figures: "მიხეილ ჯავახიშვილი, კონსტანტინე გამსახურდია",
    works: "ჯაყოს ხიზნები, მთვარის მატარებელი"
  }
];

// ==================== ავტორიზაცია ====================
function login(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = (user.role === 'admin' || user.role === 'teacher') ? 'admin.html' : 'dashboard.html';
  } else {
    alert('არასწორი ელფოსტა ან პაროლი!');
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'auth.html';
}

// ==================== წიგნების Reader ====================
let currentBook = null;
let currentChapterIndex = 0;
let fontSize = 18;

function openReader(bookId) {
  currentBook = booksDatabase.find(b => b.id === bookId);
  if (!currentBook) return;

  currentChapterIndex = 0;
  document.getElementById('readerModal').style.display = 'flex';
  document.getElementById('readerBookTitle').textContent = currentBook.title;
  loadChapter(0);
  renderTOC();
}

function loadChapter(index) {
  if (!currentBook || !currentBook.chapters[index]) return;
  currentChapterIndex = index;

  const chapter = currentBook.chapters[index];
  document.getElementById('bookText').innerHTML = `<h2>${chapter.title}</h2><p>${chapter.text}</p>`;

  updateProgress();
  document.getElementById('prevBtn').disabled = index === 0;
  document.getElementById('nextBtn').disabled = index === currentBook.chapters.length - 1;
}

function renderTOC() {
  const list = document.getElementById('tocList');
  list.innerHTML = '';
  currentBook.chapters.forEach((ch, i) => {
    const li = document.createElement('li');
    li.textContent = ch.title;
    li.style.padding = "8px";
    li.style.cursor = "pointer";
    li.onclick = () => loadChapter(i);
    if (i === currentChapterIndex) li.style.fontWeight = 'bold';
    list.appendChild(li);
  });
}

function updateProgress() {
  const progress = currentBook.chapters.length > 0 
    ? Math.round(((currentChapterIndex + 1) / currentBook.chapters.length) * 100) 
    : 0;
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${progress}%`;
}

function nextChapter() {
  if (currentChapterIndex < currentBook.chapters.length - 1) loadChapter(currentChapterIndex + 1);
}
function prevChapter() {
  if (currentChapterIndex > 0) loadChapter(currentChapterIndex - 1);
}

function changeFontSize(delta) {
  fontSize = Math.max(14, Math.min(28, fontSize + delta));
  document.getElementById('bookText').style.fontSize = `${fontSize}px`;
}

function changeFontFamily() {
  const family = document.getElementById('fontFamily').value;
  document.getElementById('bookText').style.fontFamily = family;
}

function changeTheme() {
  const theme = document.getElementById('themeSelect').value;
  const content = document.getElementById('readerContent');
  content.className = `reader-content ${theme}`;
}

function toggleFullscreen() {
  const modal = document.getElementById('readerModal');
  if (!document.fullscreenElement) modal.requestFullscreen();
  else document.exitFullscreen();
}

function closeReader() {
  document.getElementById('readerModal').style.display = 'none';
}

// Keyboard shortcuts Reader-ისთვის
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('readerModal');
  if (modal.style.display !== 'flex') return;
  if (e.key === 'ArrowRight') nextChapter();
  if (e.key === 'ArrowLeft') prevChapter();
  if (e.key === 'Escape') closeReader();
});

// გლობალური ფუნქციები
window.login = login;
window.logout = logout;
window.openReader = openReader;
window.nextChapter = nextChapter;
window.prevChapter = prevChapter;
window.changeFontSize = changeFontSize;
window.changeFontFamily = changeFontFamily;
window.changeTheme = changeTheme;
window.toggleFullscreen = toggleFullscreen;
window.closeReader = closeReader;
