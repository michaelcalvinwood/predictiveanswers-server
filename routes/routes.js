const router = require('express').Router();
const databaseInterface = require('../database/database-interface');

// I usually leave this route in to link to server monitoring tools to make sure the server is up
router.route('/helloworld')
    .get((req, res) => {
        res.status(200).send('hello world');
    });

router.route('/user')
    .post(databaseInterface.addUser);

router.route('/questions')
    .get(databaseInterface.getQuestions);

router.route('/answer')
    .post(databaseInterface.setAnswer)

module.exports = router;