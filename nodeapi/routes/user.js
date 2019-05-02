const express = require('express');
const router = express();

// halpers
const { userById } = require('../halpers');

// authorization
const { requireSignin } = require('../authorization')

// validator

// controllers
const { allUsers, getUser, updateUser, deleteUser, userPhoto, addFollowing, addFollower } = require('../controllers/user');

// route
router.get('/users', allUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, updateUser);
router.delete('/user/:userId', requireSignin, deleteUser);
// photo
router.get("/user/photo/:userId", userPhoto);
// folowers and folowing
router.put('/user/follow', requireSignin, addFollowing, addFollower);

// param
router.param('userId', userById); // any route containing :userId, our app will first execute userById()

module.exports = router;