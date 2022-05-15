const PORT=8080;
const DOMAIN="predictiveanswers.com";
const express = require('express');
const cors = require('cors');
const app = express();
const https = require('https');
const fs = require('fs');

app.use(express.static('public'));
app.use(express.json({limit: '200mb'})); 
app.use(cors());

const httpsServer = https.createServer({
 key: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`),
 cert: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`),
}, app);

httpsServer.listen(PORT, () => {
 console.log(`HTTPS Server running on port ${PORT}`);
});
