const knex = require('knex')(require('../knexfile').development);
const bcrypt = require("bcrypt");
require('dotenv').config();

const insertUser = (userName, email, password) => {
    return knex('users')
    .insert ({
        user_name: userName,
        password: bcrypt.hashSync(password, 10),
        email: email
    })
}

exports.addUser = (req, res) => {
    let {userName, email, password} = req.body;

    if (!userName || !email || !password) {
        res.status(400).send('invalid');
        return;
    } 

    insertUser(userName, email, password)
    .then (info => {
        res.status(200).send("OK");
    })
    .catch (error => {
        res.status(400).json(error);
        return;
    })
}

exports.getQuestions = (req, res) => {
    knex('questions')
    .select('num', 'question')
    .orderBy('num', 'asc')
    .then (data => {
        res.status(200).json(data);
        return;
    })
    .catch (error => {
        res.status(400).json(error);
        return;
    })
}

const deleteAnswer = (id, questionNumber) => {
    return knex('answers')
    .del()
    .where({
        id: id,
        question_number: questionNumber
    })
}

const insertAnswer = (id, questionNumber, answer) => {
    return deleteAnswer(id, questionNumber)
    .then(data => {
        return knex('answers')
        .insert({
            id: id,
            question_number: questionNumber,
            answer: answer
        })
    })
}

exports.setAnswer = ((req, res) => {
    const {id, questionNumber, answer } = req.body;

    if (!id || !questionNumber || !answer) {
        res.status(400).send('invalid');
        return;
    }

    insertAnswer(id, questionNumber, answer)
    .then(result => {
        res.status(200).send('answer updated');
        return;
    })
    .catch(error => {
        res.status(400).json(error);
        return;
    })
}) 