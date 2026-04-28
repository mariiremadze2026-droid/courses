const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { sequelize, User, Course, Lesson, Submission } = require('./models');

const app = express();
const JWT_SECRET = "lms_super_secret_2026";

app.use(cors());
app.use(express.json());

// Auth Middleware - ტოკენის შემოწმება
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(" ")[1];
    if (!token) return res.status(403).json({ error: "წვდომა შეზღუდულია" });
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "არასწორი ტოკენი" });
        req.user = decoded;
        next();
    });
};

// --- API როუტები ---

// ლოგინი (მხოლოდ იმეილით)
app.post('/api/auth/login', async (req, res) => {
    const { email } = req.body;
    let [user] = await User.findOrCreate({ 
        where: { email }, 
        defaults: { username: email.split('@')[0], role: 'student' } 
    });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, role: user.role, username: user.username });
});

// კურსების წამოღება
app.get('/api/courses', async (req, res) => {
    const courses = await Course.findAll();
    res.json(courses);
});

// კურსის დამატება (მხოლოდ ადმინი)
app.post('/api/courses', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({error: "მხოლოდ ადმინებისთვის"});
    const course = await Course.create({ ...req.body, instructor_id: req.user.id });
    res.json(course);
});

// გაკვეთილების წამოღება
app.get('/api/courses/:courseId/lessons', async (req, res) => {
    const lessons = await Lesson.findAll({ where: { CourseId: req.params.courseId } });
    res.json(lessons);
});

// დავალების გაგზავნა
app.post('/api/submissions', verifyToken, async (req, res) => {
    const submission = await Submission.create({ 
        content: req.body.content, 
        LessonId: req.body.lessonId, 
        UserId: req.user.id 
    });
    res.json({ success: true, submission });
});

// სინქრონიზაცია და გაშვება
sequelize.sync().then(() => {
    app.listen(5000, () => console.log("LMS Backend მუშაობს პორტზე 5000"));
});
