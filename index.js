const connectToMongo=require('./dbConnection')
const express = require('express')
const auth = require('./routes/Auth')
// const connectToMongoav=require('./routes/auth')
const app = express();
const port = 5000
app.use(express.json())

connectToMongo();
app.get("/api/auth",()=>{
  console.log("routeing from index file");
})

app.use('/api/auth',auth)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})