const mongoose = require('mongoose');

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true , 
            useUnifiedTopology: true ,
            useCreateIndex: true,
            useFindAndModify: false
        });  
        console.log(`Successfully connected to ${process.env.MONGODB_URL}`) 
    } catch (error) {
        console.log(error);
    }
})();
