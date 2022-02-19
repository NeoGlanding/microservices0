const express = require("express");
const cors = require('cors');
const {randomBytes} = require('crypto');

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.status(200).json(posts)
});

app.post('/events', (req, res) => {
    let {type, data} = req.body;

    console.log(type, data)

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

    res.send({})
})

app.listen(4002, () => console.log('Running at port 4002'))