const express =require('express')
const productRoutes = require('./Route/product');
const userRoutes =require('./Route/user')
const bodyParser = require('body-parser');

require('dotenv').config();
const connectdb =require('./db/connect')

const app=express();
app.use(express.json());

app.use(userRoutes)
app.use(productRoutes)
app.use(bodyParser.json());


const PORT =3000 || process.env.PORT


const start =async()=>{
    try{
        await connectdb()
        app.listen(PORT,()=>{
            console.log(`connection sucessful`)
        })
    }
    catch(e){
        console.log(e)
    }
}

start();