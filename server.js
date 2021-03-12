const express = require('express')
const mongodb = require('mongodb')
const cors = require('cors')
const dotenv = require('dotenv')

const router = express()
router.use(express.json())
router.use(cors())
dotenv.config()

const mongoClient = mongodb.MongoClient;
const DB_URL   = process.env.DBURL || "mongodb://127.0.0.1:27017";
const port = process.env.PORT||3000;

router.post('/createticket',async (req,res)=> {
    try{
        const client = await mongoClient.connect(DB_URL,{useUnifiedTopology:true})
        const db = client.db('ticket')
        const data = {
           id:req.body.id,
           queryTitle:req.body.queryTitle,
           description:req.body.description 
        }
      await db.collection('ticket').insertOne(data);
      client.close()
      res.status(200).json({message:"created"})     
    }
    catch(error){
        console.log(error)
        res.sendStatus(500);
    }
 
})

router.get('/getticket',async (req,res) => {
    try{
        const client =  await mongoClient.connect(DB_URL)
        const db = client.db('ticket')
        let data = await db.collection('ticket').find().toArray()
        client.close();
        res.status(200).json(data)
    }
    catch(error){
        console.log(error)
        res.sendStatus(404)
    }
})

router.put('/editticket/:id',async (req,res)=>{
    try{
        const client = await mongoClient.connect(DB_URL)
        const db = client.db('ticket')
        let dat = await db.collection('ticket').findOne({id:req.params.id})
        if(dat){
            const data = {
                id:req.body.id,
                queryTitle:req.body.queryTitle,
                description:req.body.description 
             }
            await db.collection('ticket').updateOne({id:req.params.id},{$set:data})
            client.close();
            res.status(200).json({
                message: "One document updated"
            })
        }else{
            res.status(200).json({
                message: "Id not found!"
            })
        }

    }catch(error){
        console.log(error)
    }
})

router.delete("/deleteticket/:id",async (req,res)=>{
    try{
        const client = await mongoClient.connect(DB_URL,{useUnifiedTopology:true})
        const db = client.db('ticket')

        del = req.params.id
        console.log(del)
         await db.collection("ticket").deleteOne({id:del})
        client.close()
        res.status(200).json({
            message : "Delete Success"
        })
    }
    catch(error){
        console.log(error)
    }
})

router.listen(port, () => console.log("::: Server is UP and running successfully :::"))
