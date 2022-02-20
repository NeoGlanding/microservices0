const express = require("express");
const cors = require('cors');
const {randomBytes} = require('crypto');
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

const eventHandler = (type, data) => {
    if (type === 'Post Created') {
        const {id, title} = data;

        posts[id] = {id, title}

    } else if (type === 'Comment Created') {
        const {id, content, postId, status} = data;

        let post = posts[postId];
        post.comments = post.comments || [];

        post.comments.push({id, content, status})
    } else if (type === 'Update Comment') {
        let {id, content, postId, status} = data;

        let post = posts[postId];
        let index = post.comments.findIndex(el => el.id === id);
        console.log(index)

        post.comments[index].status = status
    }
}

app.get('/posts', (req, res) => {
    res.status(200).json(posts)
});

app.post('/events', (req, res) => {
    let {type, data} = req.body;

    console.log(type, data)

    eventHandler(type, data)

    res.send({})
})

app.listen(4002, async () => {
    try {
        console.log('Running at port 4002');

        let {data: events} = await axios.get('http://localhost:4005/events');

        for (ev of events) {
            console.log('Processing event ', ev.type)
            eventHandler(ev.type, ev.data)
        }

    } catch (error) {
        console.log(error)
    }
})