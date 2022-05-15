const router = require('express').Router();

router.route('/helloworld')
    .get((req, res) => {
        res.status(200).send('hello world');
    });


module.exports = router;