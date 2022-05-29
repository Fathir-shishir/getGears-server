const express = require('express')
require("dotenv").config()
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// dbuser
// user : get-gears
//  password : xMPrZ2brvnbVymbJ
// middelware 

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cbcnz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const servicesCollection = client.db("get-gears").collection("products");
      const reviewsCollection = client.db("get-gears").collection("reviews");
      const orderDetailsCollection = client.db("get-gears").collection("orderDetails");
      const myProfileCollection = client.db("get-gears").collection("myprofile");
      const userCollection = client.db("get-gears").collection("users");
      app.get("/services",async(req,res)=>{
          const query={};
          const cursor = servicesCollection.find(query);
          const services = await cursor.toArray()
          res.send(services)
      })
      app.get("/user",async(req,res)=>{
          const query={};
          const cursor = userCollection.find(query);
          const users = await cursor.toArray()
          res.send(users)
      })
      app.get("/admin/:email",async(req,res)=>{
        const email=req.params.email;
        const user =await userCollection.findOne({email:email})
        const isAdmin = user.role === 'admin'
        res.send({admin:isAdmin})
      })
      app.delete("/admin/:email",async(req,res)=>{
        const email=req.params.email;
        const user =await userCollection.deleteOne({email:email})
        res.send(user)
      })
      app.put("/user/:email",async(req,res)=>{
        const user=req.body;
        const email=req.params.email;
        console.log(email)
        const filter={email:email}
        const options={upsert:true};
        const updateDoc = {
          $set:user,
        };
      const result=await userCollection.updateOne(filter,updateDoc,options);
       res.send(result)
      });
      app.put("/user/admin/:email",async(req,res)=>{
       
        const email=req.params.email;
       
        const filter={email:email}
       
        const updateDoc = {
          $set:{role:'admin'},
        };
      const result=await userCollection.updateOne(filter,updateDoc);
       res.send(result)
      });
      app.get("/services/:id",async(req,res)=>{
          const id =req.params.id;
          const query={_id:ObjectId(id)};
          const services = await servicesCollection.findOne(query)
          res.send(services)
      })
    //   app.get("/services",async(req,res)=>{
    //       const query={};
    //       const cursor = servicesCollection.find(query);
    //       const services = await cursor.toArray()
    //       res.send(services)
    //   })
      app.get("/reviews",async(req,res)=>{
          const query={};
          const cursor = reviewsCollection.find(query);
          const reviews = await cursor.toArray()
          res.send(reviews)
      })
      app.post("/orderDetails",async(req,res)=>{
          const orderDetails=req.body;
          const result = await orderDetailsCollection.insertOne(orderDetails);
          res.send(result)
      })
      app.post("/myprofile",async(req,res)=>{
          const myProfile=req.body;
          const result = await myProfileCollection.insertOne(myProfile);
          res.send(result)
      })
      app.post("/services",async(req,res)=>{
          const myProfile=req.body;
          const result = await servicesCollection.insertOne(myProfile);
          res.send(result)
      })
      app.post("/reviews",async(req,res)=>{
          const myProfile=req.body;
          const result = await reviewsCollection.insertOne(myProfile);
          res.send(result)
      })
      app.get("/orderDetails",async(req,res)=>{
        const email =req.query.email  
        const query={email : email };
        const orderDetails = await orderDetailsCollection.find(query).toArray();
        res.send(orderDetails)
    })

     
     
    }
    finally{

    }
  }
  run()

app.get('/', (req, res) => {
  res.send(' hello from gears server')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})