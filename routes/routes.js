const router = require('express').Router();
const databaseInterface = require('../database/database-interface');

router.route('/helloworld')
    .get((req, res) => {
        res.status(200).send('hello world');
    });

router.route('/user')
    .post(databaseInterface.addUser);

module.exports = router;