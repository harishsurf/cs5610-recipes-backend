const userModel = require('../models/users/users.model.server');
const browsingUserModel = require('../models/browsing-users/browsing-users.model.server');
const adminUserModel = require('../models/admin-users/admin-users.model.server');
const authorUserModel = require('../models/author-users/author-users.model.server');

const addUser = async (user) => {
    const newUser = new userModel({
        ...user,
    });
    const addedUser = await newUser.save();
    if (!addedUser) {
        return null;
    }
    const newBrowsingUser = new browsingUserModel({
        user: addedUser._id
    });
    const newUserAdded = {
        ...addedUser._doc,
        type: 'BROWSING',
    };
    newBrowsingUser.save();
    return newUserAdded;
}

const addAdminUser = async (user) => {
    const newUser = new userModel({
        ...user,
    });
    const addedUser = await newUser.save();
    if (!addedUser._id) {
        return null;
    }
    const newBrowsingUser = new adminUserModel({
        user: addedUser._id
    });
    newBrowsingUser.save();
    return addedUser._doc;
}

const findAllUsers = async () => {
    return await userModel.find();
}

const updateUser = async (userId, updatedUser) => {
    const checkIfUserExist = await userModel.findById(userId);
    if (!checkIfUserExist) {
        return 0;
    }
    const user = await userModel.findByIdAndUpdate(userId, updatedUser, {
        new: true,
    });
    if (user) {
        return 1;
    }
    return 0;
}

const updateUserRole = async (requestedUser, userId, type) => {
    const adminUser = adminUserModel.find({
        user: requestedUser,
    });
    let updatedRecord;
    if (adminUser) {
        await browsingUserModel.findOneAndDelete({user: userId});
        await adminUserModel.findOneAndDelete({user: userId});
        await authorUserModel.findOneAndDelete({user: userId});
        switch (type) {
            case 'AUTHOR':
                updatedRecord = new authorUserModel({
                    user: userId,
                });
                break;
            case 'BROWSING':
                updatedRecord = new browsingUserModel({
                    user: userId,
                });
                break;
            case 'ADMIN':
                updatedRecord = new adminUserModel({
                    user: userId,
                });
                break;
            default:
                updatedRecord = null;
        }

        await updatedRecord.save();
        const finalUser = await findUserById(userId);
        console.log("Final answer", finalUser);
        return finalUser;
    } else {
        return null;
    }
}

const validateUser = async (username, password) => {
    const user = await userModel.findOne({
        'username': username,
        'password': password
    });
    if (!user) {
        return null;
    }
    const browsingUser = await browsingUserModel.findOne({
        user: user._id,
    });
    if (browsingUser) {
        return {
            ...user._doc,
            type: 'BROWSING',
        };
    }
    const adminUser = await adminUserModel.findOne({
        user: user._id,
    });
    if (adminUser) {
        return {
            ...user._doc,
            type: 'ADMIN',
        };
    }
    const authorUser = await authorUserModel.findOne({
        user: user._id,
    });
    if (authorUser) {
        return {
            ...user._doc,
            type: 'AUTHOR',
        };
    }
    return null;
}

const findUserById = async (userId) => {
    const user = await userModel.findOne({
        _id: userId,
    });
    if (!user) {
        return null;
    }
    const browsingUser = await browsingUserModel.findOne({
        user: user._id,
    });
    if (browsingUser) {
        return {
            ...user._doc,
            type: 'BROWSING',
        };
    }
    const adminUser = await adminUserModel.findOne({
        user: user._id,
    });
    if (adminUser) {
        return {
            ...user._doc,
            type: 'ADMIN',
        };
    }
    const authorUser = await authorUserModel.findOne({
        user: user._id,
    });
    if (authorUser) {
        return {
            ...user._doc,
            type: 'AUTHOR',
        };
    }
    return null;
}

const deleteUser = async (userId) => {
    const data = await userModel.deleteOne({
        _id: userId,
    });

    await browsingUserModel.deleteOne({
        _id: userId,
    });

    await adminUserModel.deleteOne({
        _id: userId,
    });

    await authorUserModel.deleteOne({
        _id: userId,
    });

    return data;
}

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
