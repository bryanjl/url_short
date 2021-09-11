const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
//security
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

dotenv.config({ path: './config/config.env' });

//route files
const links = require('./routes/link');
const auth = require('./routes/auth');

//conect to DB
connectDB();

const app = express();

//logger for dev mode
if(process.env.NODE_ENVIRONMENT === 'development'){
    app.use(morgan('dev'));
}


//body parser
app.use(express.json());

//Sanitize - SQL injection protection
app.use(mongoSanitize());
app.use(helmet());

//router mounting
app.use('/', links);
app.use('/auth', auth);

//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Running on PORT ${PORT}`));

