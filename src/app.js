const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRote');
const passport = require('passport');
const setupSwagger = require('./config/swagger');
require('./middleware/authenticationMiddleware');

require('./database');
app.use(express.json());

setupSwagger(app);

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', userRouter);
app.use('/auth', authRouter);

module.exports = app;