const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRote');

require('./database');
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', userRouter);
app.use('/auth', authRouter);

module.exports = app;