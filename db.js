import mongoose from 'mongoose'
const MongoUri ="mongodb+srv://jobsea:Allahuakbar2027!@cluster0.bje6ver.mongodb.net/?retryWrites=true&w=majority"


const connectDB = async() => {
    try{
        const conn = await mongoose.connect(MongoUri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
          
          })
        console.log("Connnected to mongodb")
    }
    catch(error){
        console.log(error);
    }
}
export default connectDB;