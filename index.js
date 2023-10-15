const connectToMongo=require('./dbConnection')
const express = require('express')
const auth = require('./routes/Auth')
const note=require('./routes/Note')
var cors = require('cors')

// const connectToMongoav=require('./routes/auth')
const app = express();
const port = 5000


app.use(cors())

app.use(express.json())
connectToMongo();

app.use('/api/auth',auth)
app.use('/api/note',note)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})