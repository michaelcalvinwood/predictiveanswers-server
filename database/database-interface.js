const knex = require('knex')(require('../knexfile').development);
const bcrypt = require("bcrypt");
require('dotenv').config();
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

const superSecretKey=process.env.SUPERSECRETKEY;

exports.login = (req, res) => {
    const {user, password} = req.body;
    if (!user || !password) {
        res.status(401).json({token: null});
        return;
    }

    let userId = -1;

    knex('users')
    .select('password')
    .where({
        user_name: user
    })
    .then(info => {
        if (!info.length) {
            res.status(401).json({token: null});
            return;
        }
        if (!info[0].password) {
            res.status(401).json({token: null});
            return;
        }

        const passwordHash = info[0].password;
        const verified = bcrypt.compareSync(password, passwordHash);

        if (verified) {
            let token = jwt.sign({user: user}, superSecretKey);
            res.status(200).json({token: token});
            return;
        }

        res.status(401).json({token: null})
    })
}

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

exports.getResults = (req, res) => {
    knex('answers')
    .select('id', 'question_number', 'answer')
    .then(data => {
        res.status(200).json(data);
        return;
    })
    .catch(error => {
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
    .catch(error => {
        console.log(error);
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

const updateAnswers = (answers, curNum, res) => {
    if (curNum > answers.length) {
        return;
    }

    const { id, questionNumber, answer } = answers[curNum];

    insertAnswer(id, questionNumber, answer)
    .then(result => {
        let test = curNum + 1;
        if (test < answers.length) updateAnswers(answers, curNum + 1, res);
        else {
            res.status(200).send('answers updated');
        };
    })
}

const sendAdminEmail = (answers) => {
    const transporter = nodemailer.createTransport({
        host: "mail.b.hostedemail.com",
        port: 465,
        auth: {
            user: process.env.SMTPUSER,
            pass: process.env.SMTPPASS
        }
    })

    // create message to send admin
    let message = "<table>";
    for (let i = 0; i < answers.length; ++i) {
        const num = answers[i].questionNumber;
        const answer = answers[i].answer;
        message += `<tr><td>${num}</td><td>${answer}</td></tr>`;
    }
    message += "</table>";

    knex('users')
    .select('email')
    .where({
        user_name: 'admin'
    })
    .then(data => {
        const emailAddress = data[0].email;
         transporter.sendMail({
            from: process.env.SMTPUSER,
            to: emailAddress,
            subject: `Questionaire results for ${answers[0].id}`,
            html: message
        });
    })
}

exports.setAnswers = ((req, res) => {
    
    const answers = req.body;

    updateAnswers(answers, 0, res);

    sendAdminEmail(answers)
    
})