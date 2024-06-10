const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskLabel: {
        type: String,
        required: [true, 'Task label is required']
    },
    status: {
        type: String,
        required: [true, 'Status is required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    taskName: {
        type: String,
        required: [true, 'Task name is required']
    },
    taskDescription: {
        type: String,
        required: [true, 'Task description is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    tags: {
        type: [String],
        required: [true, 'Tags are required'],
        validate: {
            validator: tagsArray => tagsArray.length > 0,
            message: 'At least one tag is required'
        }
    },
    priority: {
        type: String,
        required: [true, 'Priority is required']
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
