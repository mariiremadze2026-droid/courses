const API_URL = "http://localhost:5000/api";
const api = {
    async login(email) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return res.json();
    },
    async getCourses() {
        const res = await fetch(`${API_URL}/courses`);
        return res.json();
    },
    async getLessons(courseId) {
        const res = await fetch(`${API_URL}/courses/${courseId}/lessons`);
        return res.json();
    },
    async postCourse(data) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    async submitAssignment(data) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/submissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        return res.json();
    }
};
