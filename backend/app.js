const express = require('express');
const connectToMongo = require('./src/utils/db.js');
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors());
const port = 5000;



//User Routes
const userRouter = require('./src/routes/user.route.js')
const taskRouter = require('./src/routes/task.route.js')
app.use('/api/users', userRouter);
app.use('/api/task', taskRouter)






connectToMongo();

app.get("/", (req, res) => {
    res.send("Kanbans");
});

app.listen(port, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
        return;
    }
    console.log(`Server is Running at port : http://localhost:${port}`);
});
