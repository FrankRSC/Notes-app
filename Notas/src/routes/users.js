const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/User');


router.get('/users/signin', (req,res) =>{
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true,
}));

router.get('/users/signup', (req,res) =>{
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const {nombre, email, password, coPassword} = req.body;
    const errors = [];
    if(nombre.length <= 0){
        errors.push({text: 'Introduzca su nombre por favor.'})
    }
    if(email.length <= 0){
        errors.push({text: 'Introduzca su correo por favor.'})
    }
    if(password.length <= 0){
        errors.push({text: 'Introduzca una contrasena por favor.'})
    }
    if(coPassword.length <= 0){
        errors.push({text: 'Introduzca la confirmacion de contrasena por favor.'})
    }
    if(password != coPassword){
        errors.push({text: 'Las contrasenas no coinsiden'})
    }
    if(password.length < 4){
        errors.push({text: 'La contrasena debe ser mayor a 4 caracteres.'})
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, nombre, email})
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'El correo ya esta registrado');
            res.redirect('/users/signup');
        }
        const newUser = new User({nombre, email, password});
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save();
        req.flash('succes_msg', 'Registro completado');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req,res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;