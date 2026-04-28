const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('lms_db', 'postgres', 'your_password', {
    host: 'localhost',
    dialect: 'postgres', // ან 'mysql'
    logging: false
});

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.ENUM('admin', 'student'), defaultValue: 'student' }
});

const Course = sequelize.define('Course', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT }
});

const Lesson = sequelize.define('Lesson', {
    title: { type: DataTypes.STRING, allowNull: false },
    content_url: { type: DataTypes.STRING } // YouTube ლინკი
});

const Submission = sequelize.define('Submission', {
    content: { type: DataTypes.TEXT, allowNull: false },
    grade: { type: DataTypes.INTEGER }
});

// კავშირები
Course.hasMany(Lesson, { onDelete: 'CASCADE' });
Lesson.belongsTo(Course);
User.hasMany(Submission);
Submission.belongsTo(User);
Lesson.hasMany(Submission);
Submission.belongsTo(Lesson);

module.exports = { sequelize, User, Course, Lesson, Submission };
