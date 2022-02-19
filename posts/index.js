const express = require("express");
const cors = require('cors');
const {randomBytes} = require('crypto');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', async (req, res, next) => {
   try {
     res.status(200).json({
         message: 'success',
         posts
     })
   } catch(err) {
       console.log(err)
   }
})

app.post('/posts', async (req, res, next) => {
    try {
        let {title} = req.body;
        let id = randomBytes(4).toString('hex');

        posts[id] = {
            id,
            title
        }

        await axios.post('http://localhost:4005/events', {
            type: 'Post Created',
            data: {
                id, title
            }
        })

        // let data = await axios.post('localhost:4005/events', {
        //     type: 'Post Created',
        //     data: {
        //         id,
        //         title
        //     }
        // });


        res.status(201).json({
            message: 'success',
            posts
        })
    } catch(err) {
        console.log(err)
    }
});

app.post('/events', async (req, res) => {
    console.log('Event received by posts ', req.body.type);

    res.send({})
})

app.listen(4000, () => console.log('Running at port 4000'))