const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const cors = require('cors');
app.use(
    cors({
        origin: '*'
    })
);

app.get('/*', (req, res) => {
    const recipient = req.originalUrl.split('/')[1];
    const recipientURL = process.env[recipient];
    console.log({ recipient, recipientURL, body: req.body });
    if (recipientURL) {
        const axiosConfig = {
            method: req.method,
            url: `${recipientURL}${req.originalUrl}`,
            ...(Object.keys(req.body || {}).length > 0 && { data: req.body })
        };

        axios(axiosConfig)
            .then((r) => {
                console.log('response ---', r.data);
                res.json(r.data);
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
                if (error.response) {
                    res.status(error.status).json(error.data);
                }
            });
    } else {
        res.status(502).send('Cannot process request');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
