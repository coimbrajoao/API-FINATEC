const express = require('express');
const app = express();
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRote');

require('../database');
app.use(express.json());
app.use('/users', userRouter);
app.use('/auth', authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});