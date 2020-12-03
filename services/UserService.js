const UserModel = require('../models/User.model');
const BrowsingUserModel = require('../models/BrowsingUser.model');
const AdminUserModel = require('../models/AdminUser.model');
const AuthorUserModel = require('../models/AuthorUser.model');

addUser = async (user) => {
    const newUser = new UserModel({
        ...user,
    });
    const addedUser = await newUser.save();
    if(!addedUser._id) {
        return null;
    }
    const newBrowsingUser = new BrowsingUserModel({
        user: addedUser._id
    });
    const newUserAdded = {
        ...addedUser._doc,
        type: 'BROWSING',
    };
    newBrowsingUser.save();
    return newUserAdded;
}

addAdminUser = async (user) => {
    const newUser = new UserModel({
        ...user,
    });
    const addedUser = await newUser.save();
    if(!addedUser._id) {
        return null;
    }
    const newBrowsingUser = new AdminUserModel({
        user: addedUser._id
    });
    newBrowsingUser.save();
    return addedUser._doc;
}

findAllUsers = async (_id) => {
    const adminUser = await AdminUserModel.findOne({
        user: _id,
    });
    if(adminUser) {
        const allUsers = await UserModel.find();
        return allUsers;
    }
    return null;
}

updateUser = async (userId, updatedUser) => {
    const checkIfUserExist = await UserModel.findById(userId);
    if(!checkIfUserExist) {
        return 0;
    }
    const user = await UserModel.findByIdAndUpdate(userId, updatedUser, {
        new: true,
    });
    if(user) {
        return 1;
    }
    return 0;
}

updateUserRole = async (requestingUser, userId, type) => {
    const adminUser = AdminUserModel.find({
        user: requestingUser,
    });
    let updatedRecord;
    if(adminUser) {
        await BrowsingUserModel.findOneAndDelete({user: userId});
        await AdminUserModel.findOneAndDelete({user: userId});
        await AuthorUserModel.findOneAndDelete({user: userId});
        switch(type) {
            case 'AUTHOR':
                updatedRecord = new AuthorUserModel({
                    user: userId,
                });
                break;
            case 'BROWSING':
                updatedRecord = new BrowsingUserModel({
                    user: userId,
                });
                break;
            case 'ADMIN':
                updatedRecord = new AdminUserModel({
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

validateUser = async (username, password) => {
    const user = await UserModel.findOne({
        'username': username,
        'password': password
    });
    if(!user) {
        return null;
    }
    const browsingUser = await BrowsingUserModel.findOne({
        user: user._id,
    });
    if(browsingUser) {
        return {
            ...user._doc,
            type: 'BROWSING',
        };
    }
    const adminUser = await AdminUserModel.findOne({
        user: user._id,
    });
    if(adminUser) {
        return {
            ...user._doc,
            type: 'ADMIN',
        };
    }
    const authorUser = await AuthorUserModel.findOne({
        user: user._id,
    });
    if(authorUser) {
        return {
            ...user._doc,
            type: 'AUTHOR',
        };
    }
    return null;
}

findUserById = async (_id) => {
    const user = await UserModel.findOne({
        _id: _id,
    });
    if(!user) {
        return null;
    }
    const browsingUser = await BrowsingUserModel.findOne({
        user: user._id,
    });
    if(browsingUser) {
        return {
            ...user._doc,
            type: 'BROWSING',
        };
    }
    const adminUser = await AdminUserModel.findOne({
        user: user._id,
    });
    if(adminUser) {
        return {
            ...user._doc,
            type: 'ADMIN',
        };
    }
    const authorUser = await AuthorUserModel.findOne({
        user: user._id,
    });
    if(authorUser) {
        return {
            ...user._doc,
            type: 'AUTHOR',
        };
    }
    return null;
}

deleteUser = async (user_id) => {
    const data = await UserModel.deleteOne({
        _id: user_id,
    });

    await BrowsingUserModel.deleteOne({
        _id: user_id,
    });
    
    await AdminUserModel.deleteOne({
        _id: user_id,
    });

    await AuthorUserModel.deleteOne({
        _id: user_id,
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