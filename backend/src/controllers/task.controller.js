const Task = require('../models/task.model');
const taskSchema = require('../validators/taskValidtion')

const createTask = async (req, res) => {
    const { error, value } = taskSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ error: error.details.map(detail => detail.message).join(', ') });
    }

    const { taskLabel, status, startDate, endDate, taskName, taskDescription, category, tags, priority } = value;

    try {
        const task = new Task({
            taskLabel,
            status,
            startDate,
            endDate,
            taskName,
            taskDescription,
            category,
            tags,
            priority
        });

        await task.save();

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

//delete task api
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const createdBy = req.user.userId;
        const task = await Task.findOne({ _id: id, createdBy });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await Task.deleteOne({ _id: id });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'An error occurred while deleting task' });
    }
};


//updating the task

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { taskLabel, status, startDate, endDate, taskName, taskDescription, category, tags, priority } = req.body;

        let task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }


        task.taskLabel = taskLabel;
        task.status = status;
        task.startDate = startDate;
        task.endDate = endDate;
        task.taskName = taskName;
        task.taskDescription = taskDescription;
        task.category = category;
        task.tags = tags;
        task.priority = priority;

        await task.save();

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'An error occurred while updating task' });
    }

}



// Controller function to search for tasks by name
const searchTasksByName = async (req, res) => {
    try {
        const { name } = req.query;
        const searchString = String(name);

        const tasks = await Task.find({ taskName: { $regex: searchString, $options: 'i' } });

        if (tasks.length === 0) {
            return res.status(404).json({ error: 'No tasks found with the provided name' });
        }

        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error searching for tasks:', error);
        res.status(500).json({ error: 'An error occurred while searching for tasks' });
    }
};

const searchTasksByLabel = async (req, res) => {
    try {
        const { lablename } = req.query;
        const searchString = String(lablename); // Trim whitespace

        if (!searchString) {
            return res.status(400).json({ error: 'Label name is required' });
        }

        const tasks = await Task.find({ taskLabel: { $regex: searchString, $options: 'i' } });

        if (tasks.length === 0) {
            return res.status(404).json({ error: 'No tasks found with the provided label' });
        }

        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error searching for tasks by label:', error);
        res.status(500).json({ error: 'An error occurred while searching for tasks' });
    }
};


const sortTasksByDate = async (req, res) => {
    try {
        const { sortBy } = req.query;
        let sortField = 'createdAt';
        let sortOrder = 'asc';

        if (sortBy === 'startDate' || sortBy === 'endDate') {
            sortField = sortBy;
            sortOrder = 'asc';
        }

        const tasks = await Task.find().sort({ [sortField]: sortOrder });

        if (tasks.length === 0) {
            return res.status(404).json({ error: 'No tasks found' });
        }

        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error sorting tasks by date:', error);
        res.status(500).json({ error: 'An error occurred while sorting tasks' });
    }
};







module.exports =
{
    createTask,
    deleteTask,
    updateTask,
    searchTasksByName,
    searchTasksByLabel,
    sortTasksByDate
};
