const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/recipes', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if (!err) {
        console.log('Successfully Connected in MongoDB')
    } else {
        console.log('Syntax Error: ' + err)
    }
});
