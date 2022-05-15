const PORT = 8080;
const DOMAIN = "predictiveanswers.com";
const express = require('express');
const cors = require('cors');
const app = express();
const https = require('https');
const fs = require('fs');
const routes = require('./routes/routes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const superSecretKey=process.env.SUPERSECRETKEY;
app.use(express.static('public'));
app.use(express.json({ limit: '200mb' }));
app.use(cors());

// check for authentication for the /results route
app.use((req, res, next) => {
    console.log(req.url);

    if (req.url !== "/results") {
        next();
        return;
    }

    const token = getToken(req);

    if (token) {
        if (jwt.verify(token, superSecretKey)) {
            req.decode = jwt.decode(token);
            console.log('decoded token', req.decode);
            next();
        } else {
            res.status(403).json({ error: "Not Authorized." });
        }
    } else {
        res.status(403).json({ error: "No token. Unauthorized." });
    }
});

function getToken(req) {
    if (!req.headers.authorization) return false;
  
    return req.headers.authorization.split(" ")[1];
  }
  

app.use('/', routes);

const httpsServer = https.createServer({
    key: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`),
}, app);

httpsServer.listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
});
