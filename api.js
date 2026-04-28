const API_URL = "http://localhost:5000/api";

const api = {
    // 1. რეგისტრაცია
    async register(userData) {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return await res.json();
        } catch (error) {
            console.error("Registration error:", error);
            return { error: "კავშირის შეცდომა" };
        }
    },

    // 2. შესვლა (Login)
    async login(credentials) {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await res.json();
            
            if (data.token) {
                // ვინახავთ ტოკენს ბრაუზერის მეხსიერებაში
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            console.error("Login error:", error);
            return { error: "ავტორიზაციის შეცდომა" };
        }
    },

    // 3. ყველა კურსის წამოღება
    async getCourses() {
        try {
            const res = await fetch(`${API_URL}/courses`);
            return await res.json();
        } catch (error) {
            console.error("Fetch courses error:", error);
            return [];
        }
    },

    // 4. კურსზე რეგისტრაცია (სტუდენტისთვის)
    async enroll(courseId) {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/courses/${courseId}/enroll`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
            });
            return await res.json();
        } catch (error) {
            console.error("Enrollment error:", error);
            return { error: "რეგისტრაცია ვერ მოხერხდა" };
        }
    },

    // 5. ახალი კურსის შექმნა (მხოლოდ ადმინისთვის)
    async postCourse(courseData) {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/courses`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(courseData)
            });
            return await res.json();
        } catch (error) {
            console.error("Create course error:", error);
            return { error: "კურსის დამატება ვერ მოხერხდა" };
        }
    }
};
