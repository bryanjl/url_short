const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const deleteDB = async() => {
    await User.deleteMany();
    console.log(`Data Deleted`);
}

deleteDB();
