const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://twitter_admin:lRTbxeZ7Eud4Vovc@cluster0.bawdral.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const postCollection = client.db('database').collection('posts') // this is post collection
        const userCollection = client.db('database').collection('users') // this is user collection

        // get
        app.get('/post', async (req, res) => {
            const post = (await postCollection.find().toArray()).reverse();
            res.send(post);
        })
        app.get('/user', async (req, res) => {
            const user = await userCollection.find().toArray();
            res.send(user);
        })
        app.get('/loggedInUser', async (req, res) => {
            const email = req.query.email;
            const user = await userCollection.find({ email: email }).toArray();
            res.send(user);
        })

        // post
        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        })
        app.post('/register', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })


    } catch (error) {
        console.log(error);
    }
} run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Hello from Twitter!')
})

app.listen(port, () => {
    console.log(`Twitter listening on port ${port}`)
})