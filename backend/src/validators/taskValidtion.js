
const Joi = require('joi');

const taskSchema = Joi.object({
    taskLabel: Joi.string().required().messages({
        'string.empty': 'Task Label is required'
    }),
    status: Joi.string().required().messages({
        'string.empty': 'Task Status is required'
    }),
    startDate: Joi.date().required().messages({
        'date.base': 'Task Start Date is required'
    }),
    endDate: Joi.date().required().messages({
        'date.base': 'Task End Date is required'
    }),
    taskName: Joi.string().required().messages({
        'string.empty': 'Task Name is required'
    }),
    taskDescription: Joi.string().required().messages({
        'string.empty': 'Task Description is required'
    }),
    category: Joi.string().required().messages({
        'string.empty': 'Task Category is required'
    }),
    tags: Joi.array().items(Joi.string()).required().messages({
        'array.base': 'Task Tags is required'
    }),
    priority: Joi.string().required().messages({
        'string.empty': 'Task Priority is required'
    })
});

module.exports = taskSchema;
