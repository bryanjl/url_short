const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

dotenv.config({ path: './config/config.env' });

//route files
const links = require('./routes/link');
const auth = require('./routes/auth');

//conect to DB
connectDB();

const app = express();

//body parser
app.use(express.json());

//router mounting
app.use('/', links);
app.use('/auth', auth);

//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Running on PORT ${PORT}`));

