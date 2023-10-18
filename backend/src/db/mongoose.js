const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/your', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });
