const userDao = require('../daos/users.dao.server');

const findAllUsers = () => userDao.findAllUsers();

const findUserById = (userId) => userDao.findUserById(userId);

const addUser = (user) => userDao.addUser(user);

const addAdminUser = (user) => userDao.addAdminUser(user);

const validateUser = (username, password) => userDao.validateUser(username, password);

const updateUser = (userId, updatedUser) => userDao.updateUser(userId, updatedUser);

const updateUserRole = (requestedUser, userId, type) => userDao.updateUserRole(requestedUser, userId, type);

const deleteUser = (userId) => userDao.deleteUser(userId);

module.exports = {
    addUser,
    addAdminUser,
    validateUser,
    updateUser,
    updateUserRole,
    findAllUsers,
    findUserById,
    deleteUser,
};
