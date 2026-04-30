const API_URL = "http://localhost:5000/api";

const api = {
    async getBooks() {
        const res = await fetch(`${API_URL}/books`);
        return res.json();
    },
    async askAI(message) {
        const res = await fetch(`${API_URL}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        return res.json();
    }
};
