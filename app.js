const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const mongoose = require("mongoose")
let items = []
let workItems = []
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static("public"))

//connect to DB
mongoose.connect("mongodb://localhost:27017/todolustDB",{useNewUrlParser: true})

//create a new schema
const itemsSchema = {
  name: String
}
//create a new mongoose model
const Item = mongoose.model("Item",itemsSchema)

//create a mongoose document
const item1 = new Item({
  name: "Welcome to your todo list"
})
//create a mongoose document
const item2 = new Item({
  name: "Hit the + button to add a new item"
})
//create a mongoose document
const item3 = new Item({
  name: "<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3]
//inserting items in database


app.get("/",function(req,res){
  Item.find({},function(err,foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else {
          console.log("Success");
        }
      })
      res.redirect("/")
    }else {
      res.render("list",{kindOfDay:"Home",kindOfItem:foundItems})
    }


  })

})

app.post("/",function(req,res){
let item = req.body.toDoItem
let postedItem = "" + item
const item4 = new Item({
  name: postedItem
})
item4.save()
items.push(item)
res.redirect("/")
})

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox
Item.findByIdAndRemove(checkedItemId,function(err){
  if (err) {
    console.log(err);
  }else {
    console.log("Deleted");
  }
})
  res.redirect("/")
})

app.get("/work",function(req,res){
  res.render("list",{kindOfDay:"Work",kindOfItem:workItems})
})

app.post("/work",function(req,res){
  workItems.push(req.body.toDoItem)
  res.redirect("/work")
})



app.listen(3000,function(){
  console.log("Server started on Port 3000")
})
