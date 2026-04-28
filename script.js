let isLoginMode = true;

// გვერდების მართვა
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "შესვლა" : "რეგისტრაცია";
}

// ინტერფეისის განახლება სტატუსის მიხედვით
function updateUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginBtn = document.getElementById('login-nav-btn');
    const logoutBtn = document.getElementById('logout-nav-btn');
    const adminLink = document.getElementById('admin-link');

    if (user) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        if (user.role === 'admin') adminLink.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        adminLink.style.display = 'none';
    }
}

// ავტორიზაციის ჰენდლერი
async function handleAuth() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (isLoginMode) {
        const data = await api.login({ email, password });
        if (data.token) {
            localStorage.setItem('user', JSON.stringify(data));
            updateUI();
            showPage('home');
        } else {
            alert("შეცდომა: " + data.error);
        }
    } else {
        const data = await api.register({ email, password, username: email.split('@')[0] });
        alert(data.message || data.error);
        isLoginMode = true;
        toggleAuthMode();
    }
}

// კურსის შექმნა (მხოლოდ ადმინისთვის)
async function createCourse() {
    const title = document.getElementById('course-title').value;
    const description = document.getElementById('course-desc').value;

    const res = await api.postCourse({ title, description });
    if (res.id) {
        alert("კურსი წარმატებით დაემატა!");
        init(); // სიის განახლება
        showPage('home');
    }
}

// კურსების ჩატვირთვა ბაზიდან
async function init() {
    const courses = await api.getCourses();
    const list = document.getElementById('course-list');
    list.innerHTML = courses.map(c => `
        <div class="course-card">
            <h3>${c.title}</h3>
            <p>${c.description}</p>
            <button class="primary-btn" onclick="handleEnroll(${c.id})">რეგისტრაცია</button>
        </div>
    `).join('');
    updateUI();
}

function logout() {
    localStorage.clear();
    location.reload();
}

init();
