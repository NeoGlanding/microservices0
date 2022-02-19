const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

app.post('/events', (req, res) => {
    const {type, data} = req.body;

    if (type === 'Comment Created') {
        const {id,content,postId,status} = data
        console.log('Event for Comment received', data);

        axios.post('http://localhost:4005/events', {
            type: `Comment Modified`,
            data: {
                id,
                content,
                postId,
                status: `${/orange/g.test(content) ? 'Rejected' : 'Granted'}`
            }
        }).then(res => {}).catch(err => console.log(err))
    }

    res.send({});
})

app.listen(4003, () => console.log('Running at port 4003'));