const express = require('express');
const router = express.Router();
const validateSession = require('../middleware/validate-session');
const profile = require('../models/profile');
const User = require('../models/User');
const Subscription = require('../db').import('../models/subscription');

router.post('/signup', validateSession, async (req, res) => {
    const subscription = {
        streetAddress1: req.body.subscription.streetAddress1,
        streetAddress2: req.body.subscription.streetAddress2,
        city: req.body.subscription.city,
        state: req.body.subscription.state,
        zip: req.body.subscription.zip,
        userId: req.user.id
    }
    
    try {
        let sub = await Subscription.create(subscription);
        res.status(200).json(sub)
    } catch (err) {
        res.status(500).json( { error: err})
    }
})

router.get('/mine', validateSession, async (req,res) => {
    let owner = req.user.id
   
    
    try {
        let sub = await Subscription.findAll({ where: { userId: owner}});
        res.status(200).json(sub)
    } catch (err) {
        res.status(500).json({ error: err})
    }
});

router.get('/all', validateSession, (req, res) => {
    if (!req.err && req.user.isAdmin){
        Subscription.findAll()
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(500).json({ error: err }));
    } else {
        return res.status(500).send({ message: 'Not Authorized' });
    }
})

router.put('/update/:entryId', validateSession, async (req, res) => {
    const updateSubscription = {
        streetAddress1: req.body.subscription.streetAddress1,
        streetAddress2: req.body.subscription.streetAddress2,
        city: req.body.subscription.city,
        state: req.body.subscription.state,
        zip: req.body.subscription.zip
    };

    const query = { where: {id: req.params.entryId, userId: req.user.id}}


    try {
        let sub = await Subscription.update(updateSubscription, query);
        res.status(200).json(sub)
    } catch (err) {
        res.status(500).json({ error: err})
    }
});

router.delete('/delete/:id', validateSession, async (req, res) => {
    const query = { where: { id: req.params.id, userId: req.user.id} };


    try {
        let entries = await Subscription.destroy(query);
        res.status(200).json( { message: 'Subscription Cancelled'})
    } catch (err) {
        res.status(500).json({ error: err});
    }
});

module.exports = router;