const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// home route
router.get('/', checkAuthenticated, (req, res) => {
        res.render('index', { username: req.user.username });
});

// register get route
router.get('/register', checkNotAuthenticated, (req, res) => {
        res.render('register');
});

// login get route
router.get('/login', checkNotAuthenticated, (req, res) => {
        knex('admin.users').then((results) => {
                if (results != 0) {
                        res.render('login', {
                                title: 'Log In',
                        });
                } else {
                        res.redirect('/register');
                }
        });
});

// login post route
router.post(
        '/login',
        checkNotAuthenticated,
        passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true,
        })
);

// register post route
router.post('/register', checkNotAuthenticated, async (req, res) => {
        const { username, password } = req.body;
        const userFound = await knex('admin.users')
                .where({ user_name: username })
                .first()
                .then((row) => row.user_name);
        if (userFound === username) {
                req.flash('error', 'User with that username already exists');
                res.redirect('/register');
        } else {
                try {
                        const hashedPassword = await bcrypt.hash(password, 10);
                        knex('admin.users')
                                .insert({
                                        user_name: username,
                                        password: hashedPassword,
                                })
                                .then(() => {
                                        res.redirect('/login');
                                });
                } catch (error) {
                        console.log(error);
                        req.flash('error', 'Cant insert');
                        res.redirect('/register');
                }
        }
});

// job-requirement route
router.get('/job-requirement', (req, res) => {
        res.render('jobRequirement');
});

// job-details route
router.get('/job-details', (req, res) => {
        res.render('jobDetails');
});

// exam route
router.get('/exam', (req, res) => {
        res.render('exam');
});

// delete/logout route
router.delete('/logout', (req, res) => {
        req.logOut();
        res.redirect('/login');
});

// about route
router.get('/about', (req, res) => {
        res.send('amsdkngowng');
});

module.exports = router;
