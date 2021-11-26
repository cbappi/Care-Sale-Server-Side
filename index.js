const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e6iub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db('myProduct');
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('orders');
        const exploresCollection = database.collection('explores');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');


        
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        
     
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        
  
        app.get('/manageallorders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        app.get('/explores', async (req, res) => {
            const cursor = exploresCollection.find({});
            const explores = await cursor.toArray();
            res.send(explores);
        });

        app.get('/explors', async (req, res) => {
            const cursor = exploresCollection.find({});
            const explors = await cursor.toArray();
            res.send(explors);
        });


        app.get('/myorders/:email', async (req, res) => {
            const cursor = ordersCollection.find({ email: req.params.email });
            const orders = await cursor.toArray();
            res.send(orders);
        });


        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific product', id);
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);
        })


        app.get('/booking-explore/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific product', id);
            const query = { _id: ObjectId(id) };
            const explore = await exploresCollection.findOne(query);
            res.json(explore);
        })


  
        app.post('/addproduct', async (req, res) => {
            const product = req.body;
            console.log('hit the post api', product);

            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result)
        });

        
        app.post('/addreviews', async (req, res) => {
            const review = req.body;
            console.log('hit the post api', review);

            const result = await reviewsCollection.insertOne(review);
            console.log(result);
            res.json(result)
        });
  

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });


        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });



        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
       
         
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
                

        })
       
        

        app.post('/exploreproduct', async (req, res) => {
            const explore = req.body;
            console.log('hit the post api', explore);

            const result = await exploresCollection.insertOne(explore);
            console.log(result);
            res.json(result)
        });

        app.post('/booking', async (req, res) => {
            const order = req.body;


            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result)
        });

    
        app.post('/booking-explore', async (req, res) => {
            const order = req.body;


            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result)
        });

      


      
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })
        app.delete('/deleteExplores/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await exploresCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally {
        
    }
}

// Submit on 16-Dec - Evenning

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Products Server - Oky');
});

app.get('/hello', (req, res) => {
    res.send('hello update here');
});

app.listen(port, () => {
    console.log('Travel Server on port', port);
})




