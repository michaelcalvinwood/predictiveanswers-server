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