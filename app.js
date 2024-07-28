const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejs_mate=require("ejs-mate");

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname,"/public/js")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejs_mate);

//mongoose connection
let main=async()=>
{
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}
main()
.then(()=>console.log("Connected to MongoDB"))
.catch((err)=>console.log(err));

//to require a model created in models folder
const Listing=require('./models/listing.js');

//listening to port number
let port=8080;
app.listen(port,()=>{
    console.log(`Server is running on: http://localhost:${port}`);
});

//root route
app.get('/',(req,res)=>{
    res.send("Hi i am root");
});

//listings route - list of all available destinations
app.get("/listings",async (req,res)=>{
    const l=await Listing.find();
    res.render("listings/index",{l});
});

//Create a new stay destination
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});

//acquire the details of stay place
app.post("/listings/new",async (req,res)=>{
    let newlisting=new Listing(req.body.listing);
    await newlisting.save().then((r)=>console.log("Inserted successfully")).catch((e)=>console.log(e));
    res.redirect("/listings");
});

//see the details of a destination in detail using object id and anchor tags
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const result=await Listing.findById(id);
    res.render("listings/show",{result});
});

//editing route for details of a destination
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const result=await Listing.findById(id);
    res.render("listings/edit",{result});
});

//put method to acquire the details obtained from the editing route
app.put("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing,{new:true})
    .then((r)=>console.log("updation successful"))
    .catch((e)=>console.log("updation unsuccessful"+e));
    res.redirect("/listings");
});

//delete route
app.delete("/listings/:id/delete",async (req,res)=>
{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
    .then((r)=>console.log(r))
    .catch((e)=>console.log(e));
    res.redirect("/listings");
});

