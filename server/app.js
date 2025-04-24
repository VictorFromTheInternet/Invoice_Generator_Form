const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const submissionRouter = require('./routes/submission_router.js')
const viewsRouter = require('./routes/views_router.js')

const app = express()
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI

async function startServer(){
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static('../frontend/public'));    
        app.use('/api/submissions', submissionRouter);
        app.use('/', viewsRouter);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

startServer()