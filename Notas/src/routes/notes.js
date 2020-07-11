const express = require('express');
const router = express.Router();

const Note = require('../models/Notes');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/agregar', isAuthenticated, (req,res) =>{
    res.render('notes/nuevanota')
});

router.post('/notes/nuevanota', isAuthenticated, async (req, res) =>{
    const {title, descripcion} = req.body;

    const errors = [];
    if(!title){
        errors.push({text:'Por favor ingrese un titulo'});
    }

    if(!descripcion){
        errors.push({text:'Por favor introdusca una descripcion'})
    }
    
    if(errors.length > 0){
        res.render('notes/nuevanota', {
            errors,
            title,
            descripcion
        });
    }else{
        
       const nuevaNota = new Note({title, descripcion});
       nuevaNota.user = req.user.id;
       await nuevaNota.save();
       req.flash('succes_msg','Nota agregada correctamente');
       res.redirect('/notes');
    }
    
});

router.get('/notes', isAuthenticated, async (req,res) =>{

   const notas = await Note.find({user: req.user.id}).sort({date: 'desc'});
   res.render('notes/todas_notas', {notas})
});

//edicion de tarjetas
router.get('/notes/editar/:id', isAuthenticated, async (req,res) =>{
    const note = await Note.findById(req.params.id)
    res.render('notes/editar_notas', {note})
});

router.put('/notes/editar_notas/:id', isAuthenticated, async (req,res) => {
    const {title, descripcion } = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title,descripcion});
    req.flash('succes_msg', 'Nota actualizada correctamente.');
    res.redirect('/notes');
});

router.delete('/notes/borrar/:id', isAuthenticated, async (req, res ) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('succes_msg', 'Nota eliminada correctamente.');
    res.redirect('/notes');
});

module.exports = router;