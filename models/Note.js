const mongoose=require('mongoose')
const {Schema} =mongoose

const notesSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
   
    description:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    },
    title:{
        type:String,
        required:true,
    },
    tag:{
        type:String,
        default:"General"
    }

})

module.exports=mongoose.model('note',notesSchema)