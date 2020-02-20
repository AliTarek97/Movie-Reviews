const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
require('./db/mongoose');
const port = process.env.PORT || 3000;

app.listen(port , () => {
    console.log(`Listening on port ${port}`);
})