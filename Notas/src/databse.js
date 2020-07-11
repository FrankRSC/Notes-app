const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost/notes-db-app',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
    
})
.then(db => console.log('DB IS CONECTED'))
.catch(err => console.error(err));