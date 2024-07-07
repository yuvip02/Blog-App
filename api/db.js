const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://yuvipradhan2002:qazwsxedc123@cluster0.fm5tkg1.mongodb.net/blog")


const db=mongoose.connection

db.on("connected",()=>
{
    console.log("connected to mongodb")
})
db.on("disconnected",()=>
    {
        console.log("MongoDb Disconnected")
    })
    
    db.on("error",(err)=>
    {
        console.log("MongoDb error: ",err)
    })
    
    module.exports=db