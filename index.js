const express =require('express')
const cors = require('cors'); // Import CORS module

const productRoutes = require('./Route/product');
const userRoutes =require('./Route/user')
const cartRoutes =require('./Route/cart')

const bodyParser = require('body-parser');

require('dotenv').config();
const connectdb =require('./db/connect')

const app=express();
app.use(express.json());
app.use(cors());

app.use(userRoutes)
app.use(cartRoutes)
app.use(productRoutes)
app.use(bodyParser.json());


const PORT =3000 || process.env.PORT


const start =async()=>{
    try{
        await connectdb()
        app.listen(PORT,()=>{
            console.log(`connection sucessful app is running on ${PORT}`)
        })
    }
    catch(e){
        console.log(e)
    }
}

start();