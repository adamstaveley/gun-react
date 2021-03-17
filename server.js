const GUN = require('gun');
const http = require('http');
const express = require('express');
const nodemailer = require('nodemailer');
const uuid = require('uuid');

const PORTS = {
    RELAY: parseInt(process.env.PORT, 10),
    NODE: parseInt(process.env.PORT, 10) + 1
}

// runs full relay peer (will sync all data)
// can also use to query if necessary
const relay = GUN({
    file: `data_${PORTS.RELAY}`,
    web: http.createServer().listen(PORTS.RELAY, () => console.log('GUN relay peer running on :' + PORTS.RELAY))
});

const node = express();
node.use(express.urlencoded({ extended: true }))

const users = {};

const sendMail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'elnora.kuhn@ethereal.email',
            pass: 'tYfDPw1CDEjStfqmqT'
        }
    })
    await transporter.sendMail({
        to: email,
        text: `Use this magic link to login: http://localhost:8080/auth/login?token=${token}`
    })
}

node.post('/auth/request-login', async (req, res) => {
    const email = req.query.email;
    const token = uuid.v4();
    users[email] = { loggedIn: false, token };
    await sendMail(email, token);
    res.end();
});

node.post('/auth/login', async (req, res) => {
    const { email, token } = req.query;
    if (users[email].token === token) {
        return res.end();
    } else {
        return res.status(401).end();
    }
})

node.listen(PORTS.NODE, () => console.log('Node running on :' + PORTS.NODE))
