const express = require('express')
require('./db/mongoose')
// require('dotenv').config();

const userRouter = require('./routers/user')
// const taskRouter = require('./routers/task')
const User = require('./models/user')
const Task = require('./models/task')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors');

// Allow cross-origin requests from all domains (for development, you can restrict this in production)
app.use(cors());

app.use(express.json())
app.use(userRouter)
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})