const { sequelize } = require('../config');
const { DataTypes } = require('sequelize');

class UserGameModel {
    #model = sequelize.define('user_game', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
    }, {
        tableName: 'user_game',
        updatedAt: false,
        underscored: true
    });

    // === QUERY
    async getAllUserGame() {
        const data = await this.#model.findAll({ raw: true });
        return data;
    }

    async getUserGame(email) {
        const data = await this.#model.findOne({ 
            where: { 
                email
            }, 
            attributes: ['id', 'username', 'email', 'password', 'created_at'],
            raw: true
        });
        return data;
    }

    async checkDuplicateEmail(email) {
        const data = await this.#model.findOne({ 
            where: { 
                email
            }, 
            attributes: ['email'],
            raw: true
        });
        return data;
    }

    async checkDuplicateUsername(username) {
        const data = await this.#model.findOne({ 
            where: { 
                username
            }, 
            attributes: ['username'],
            raw: true
        });
        return data;
    }

    async insertNewUserGame(newdata) {
        const data = await this.#model.create(newdata);
        return data;
    }

    async updateUserProfile(id, newUsername, newEmail) {
        const userData = await this.#model.findOne({
            where: {
                id
            }
        });

        if (userData) {
            userData.username = newUsername;
            userData.email = newEmail;
            await userData.save();
            return userData;
        } else {
            throw new Error('User not found.');
        }
    }

    async updateUserPassword(id, newPassword) {
        const userData = await this.#model.findOne({
            where: {
                id
            }
        });

        if (userData) {
            userData.password = newPassword;
            await userData.save();
            return userData;
        } else {
            throw new Error('User not found.');
        }
    } 
};

const userGameModel = new UserGameModel();
module.exports = { userGameModel };