const router = require('express').Router();
const User = require('../db').import('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateSession = require('../middleware/validate-session');

router.post('/register', function (req, res) {
    User.create({
        email: req.body.user.email,
        password: bcrypt.hashSync(req.body.user.password, 13),
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        isAdmin: req.body.user.isAdmin
    })
        .then(
            function registerSuccess(user) {
                let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                res.json({
                    user: user,
                    message: 'User successfully created!',
                    sessionToken: token
                });
            }
        )
        .catch(err => res.status(500).json({ error: err }))
});

router.post('/login', function (req, res) {
    User.findOne({
        where: {
            email: req.body.user.email
        }
    })
        .then(function loginSuccess(user) {
            if (user) {
                bcrypt.compare(req.body.user.password, user.password, function (err, matches) {
                    if (matches) {
                        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
                        res.status(200).json({
                            user: user,
                            message: 'User successfully logged in!',
                            sessionToken: token
                        })
                    } else {
                        res.status(502).send({ error: 'Login Failed' })
                    }
                });
            } else {
                res.status(500).json({ error: 'User does not exist.' })
            }
        })
        .catch(err => res.status(500).json({ error: err }))
});

router.put('/admin/:id', validateSession, (req, res) => {
    if (!req.err && req.body.user.isAdmin) {
        const updateUser = {
            firstName: req.body.user.firstName,
            lastName: req.body.user.lastName,
            email: req.body.user.email,
            isAdmin: req.body.user.isAdmin,
        };
        if (req.body.user.password != '') {
            updateUser.password = bcrypt.hashSync(req.body.user.password, 13)
            console.log(req.body.user.password)
        }
        const query = { where: { id: req.params.id } };
        User.update(updateUser, query)
            .then((user) => res.status(201).json({ mesage: `${user} records updated` }))
            .catch((err) => res.status(500).json({ error: err }));
    }
})

router.put('/', validateSession, (req, res) => {
    let userId = req.user.id;

    const updateUser = {
        firstName: req.body.user.firstName,
        lastName: req.body.userlastName,
        email: req.body.user.email,
    };
    if (req.body.user.password != '') {
        updateUser.password = bcrypt.hashSync(req.body.user.password, 13)
        console.log(req.body.password)
    }
    const query = { where: { id: userId } };
    User.update(updateUser, query)
        .then((user) => res.status(200).json({ message: `${user} records updated` }))
        .catch((err) => res.status(500).json({ error: err }));
});

router.delete('/:id', validateSession, function (req, res) {
    if (!req.err & req.body.user.admin) {
        const query = { where: { id: req.params.id } };

        User.destroy(query)
            .then(() => res.status(200).json({ message: 'User Deleted' }))
            .catch((err) => res.status(500).json({ error: err }));
    } else {
        return res.status(500).send({ message: 'Not Authorized' });
    }
})

router.get('/one/:id', validateSession, (req, res) => {
    User.findOne({
        where: { id: req.params.id }
    })
        .then((location) => res.status(200).json(location))
        .catch((err) => res.status(500).json({ error: err }));
});

router.get('/', validateSession, (req, res) => {
    
    user.findOne({ where: { id: req.user.id }})
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json({ error: err}));
});

router.get('/all', validateSession, (req, res) => {
    if (!req.err && req.body.user.isAdmin){
        User.findALL()
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(500).json({ error: err }));
    }else{
        return res.status(500).send({ message: 'Not Authorized' });
    }
})

module.exports = router;
