const PORT=8080;
const DOMAIN="predictiveanswers.com";
const express = require('express');
const cors = require('cors');
const app = express();
const https = require('https');
const fs = require('fs');
const routes = require('./routes/routes');

app.use(express.static('public'));
app.use(express.json({limit: '200mb'})); 
app.use(cors());

// check for authentication 
// app.use((req, res, next) => {
//     console.log(req.url);
//     if (req.url === "/signup" || req.url === "/login" || req.url.startsWith("/asset/") || req.url === "/authenticate" || req.url.startsWith('/initialize') || req.url.startsWith('/svg/')) {
//       next();
//     } else {
//       const token = getToken(req);
  
//       if (token) {
//         if (jwt.verify(token, superSecretKey)) {
//           // Decode the token to pass along to end-points that may need
//           // access to data stored in the token.
//           req.decode = jwt.decode(token);
//           next();
//         } else {
//           res.status(403).json({ error: "Not Authorized." });
//         }
//       } else {
//         res.status(403).json({ error: "No token. Unauthorized." });
//       }
//     }
//   });
  

app.use('/', routes);

const httpsServer = https.createServer({
 key: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`),
 cert: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`),
}, app);

httpsServer.listen(PORT, () => {
 console.log(`HTTPS Server running on port ${PORT}`);
});
