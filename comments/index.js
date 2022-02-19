const express = require("express");
const cors = require('cors');
const {randomBytes} = require('crypto');
const axios = require('axios');


const app = express();

app.use(express.json());
app.use(cors());

const commentByPostId = {};

app.get('/posts/:id/comments', async (req, res, next) => {
   try {
        let comments = commentByPostId[req.params.id] || []
        res.status(200).json(comments)
   } catch(err) {
       console.log(err)
   }
})

app.post('/posts/:id/comments', async (req, res, next) => {
    try {
        let {content} = req.body;
        let id = randomBytes(4).toString('hex');

        let comments = commentByPostId[req.params.id] || [];
        comments.push({id, content, status: 'pending'});

        commentByPostId[req.params.id] = comments

        await axios.post('http://localhost:4005/events', {
            type: 'Comment Created',
            data: {
                id, content, postId: req.params.id, status: 'pending'
            }
        });

        res.status(201).json(commentByPostId)
    } catch(err) {
        console.log(err)
    }
});

app.post('/events', async (req, res) => {
    try {
        let {type, data} = req.body
        console.log('Event received ', type);

        if (type === 'Comment Modified') {
            let {id, content, postId, status} = data;

            let index = commentByPostId[postId].findIndex(el => el.id === id);

            commentByPostId[postId][index].status = status;

            await axios.post('http://localhost:4005/events', {
                type: 'Update Comment',
                data: {
                    id,content,postId,status
                }
            });

        }

        res.send({})
    } catch(err) {
        console.log(err)
    }
})

app.listen(4001, () => console.log('Running at port 4001'))