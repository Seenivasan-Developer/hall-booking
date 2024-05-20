const { Console } = require("console");
const express=require("express");
const app=express();
const Port="4000";

//Middleware Injection
app.use(express.json()); 

//Route Injection
app.use("/api",require("./modules/apicontroller"))

app.get("/",(req, res, next)=>{
    res.end("Hello World")
})

app.listen(Port,()=> console.log(`Server Started on Port ${Port}`));