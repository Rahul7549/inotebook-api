const mongoose=require('mongoose');
mongooseUrl="mongodb://127.0.0.1:27017/inotebook";

const connectToMongo= async() =>{
    try{
    await mongoose.connect(mongooseUrl)
        .then(()=>{
            console.log("Connected to mongoose DB Successfully");
        }).catch(error=>{
            console.log(error.message);
        })
    }catch(error){
        console.log(error.message);
        process.exit(1);
    }

}

module.exports=connectToMongo

