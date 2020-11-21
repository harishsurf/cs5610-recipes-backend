const UserService = require('../services/UserService');

module.exports = function (app) {
    app.post('/api/users', (req, res) => {
        const user = req.body;
        UserService.addUser(user).then(newUser => {
            console.log(newUser);
            res.json(newUser);
        })
        .catch(data => {
            res.status(500).send({
                error: "Internal server problem",
            });
        });
    });

    app.post('/api/users/admin', (req, res) => {
        const user = req.body;
        console.log(user);
        UserService.addAdminUser(user).then(newUser => {
            res.json(newUser);
        }).catch(data => {
            res.status(500).send({
                error: "Cannot create user."
            });
        });
    });

    app.post('/api/users/validate', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        UserService.validateUser(username, password).then(user => {
            if(user) {
                res.json(user);
                return;
            }
            res.status(401).send({
                error: "Incorrect credentials"
            });
        }).catch(data => {
            res.status(500).send({
                error: "Incorrect credentials"
            });
        });
    });

    app.get('/api/users/all/:userId', (req, res) => {
        const userId = req.params.userId;
        UserService.findAllUsers(userId).then(users => {
            if(users) {
                res.json(users);
                return;
            }
            res.status(500).send({
                error: "Internal Server error"
            });
        }).catch(data => {
            res.status(500).send({
                error: "Internal server error"
            });
        });
    });

    app.get('/api/users/:userId', (req, res) => {
        const userId = req.params.userId;
        UserService.findUserById(userId).then(users => {
            if(users) {
                res.json(users);
                return;
            }
            res.status(500).send({
                error: "Cannot fetch User"
            });
        }).catch(data => {
            res.status(500).send({
                error: "Cannot fetch User"
            });
        });
    });

    app.put('/api/users/:userId', (req,res) => {
        const userId = req.params.userId;
        const updatedUser = req.body;
        UserService.updateUser(userId, updatedUser).then(status => {
            if(status === 1) {
                res.json(updatedUser);
                return;
            }
            res.status(500).send({
                error: "Cannot update user",
            })
        }).catch( data => { 
            res.status(500).send({
                error: "Cannot update user",
            });
        });
    });

    app.put('/api/users/:userId/role', (req,res) => {
        const userId = req.params.userId;
        const requestingUser = req.body.requestingUser;
        const role = req.body.role;
        UserService.updateUserRole(requestingUser, userId, role).then(updatedUser => {
            if(updatedUser) {
                res.json(updatedUser);
                return;
            }
            res.status(500).send({
                error: "Cannot update user",
            })
        }).catch( data => { 
            res.status(500).send({
                error: "Cannot update user",
            });
        });
    });

    app.delete('/api/users/:userId', (req,res) => {
        const userToDelete = req.params.userId;
        UserService.deleteUser(userToDelete).then((data) => {
            if(data) {
                res.json(data);
                return;
            }
            res.status(500).send({
                error: "Cannot delete User.",
            });
        }).catch( data => {
            res.status(500).send({
                error: "Cannot add user",
            });
        });
    });
}