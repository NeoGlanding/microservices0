const express = require("express");
const cors = require('cors');
const {randomBytes} = require('crypto');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const events = [];

app.post('/events', async (req, res) => {
    let event = req.body;

    events.push(event);

    console.log('Event Emitted ',event)
    try {
        await axios.post('http://localhost:4000/events', event)
        await axios.post('http://localhost:4001/events', event)
        // await axios.post('http://localhost:4002/events', event)
        await axios.post('http://localhost:4003/events', event)

        res.send({
            status: 'OK'
        })
    } catch (error) {
        console.log(error)
    }
});

app.get('/events', (req, res) => {
    res.send(events);
})

app.listen(4005, () => console.log('Running at port 4005'))