let currentLessonId = null;

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

async function handleAuth() {
    const email = document.getElementById('email').value;
    const data = await api.login(email);
    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        location.reload();
    }
}

async function init() {
    const courses = await api.getCourses();
    const list = document.getElementById('course-list');
    list.innerHTML = courses.map(c => `
        <div class="course-card">
            <h3>${c.title}</h3>
            <p>${c.description}</p>
            <button class="primary-btn" onclick="openCourse(${c.id})">ნახვა</button>
        </div>
    `).join('');
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('login-nav-btn').style.display = 'none';
        document.getElementById('logout-nav-btn').style.display = 'block';
        if (user.role === 'admin') document.getElementById('admin-link').style.display = 'block';
    }
}

async function openCourse(id) {
    const lessons = await api.getLessons(id);
    if (lessons.length === 0) return alert("გაკვეთილები არ არის");
    showPage('lesson-view');
    currentLessonId = lessons[0].id;
    document.getElementById('video-player').src = lessons[0].content_url.replace("watch?v=", "embed/");
    document.getElementById('lesson-header').innerText = lessons[0].title;
}

async function createCourse() {
    const title = document.getElementById('course-title').value;
    const description = document.getElementById('course-desc').value;
    await api.postCourse({ title, description });
    alert("კურსი დაემატა!");
    location.reload();
}

async function submitWork() {
    const content = document.getElementById('assignment-content').value;
    await api.submitAssignment({ content, lessonId: currentLessonId });
    alert("გაგზავნილია!");
}

function logout() { localStorage.clear(); location.reload(); }
init();
