const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres'
});

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'student' }
});

const Book = sequelize.define('Book', {
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING },
    subject: { type: DataTypes.STRING },
    cover: { type: DataTypes.STRING },
    pages: { type: DataTypes.ARRAY(DataTypes.TEXT) },
    quiz: { type: DataTypes.JSONB }
});

module.exports = { sequelize, User, Book };
