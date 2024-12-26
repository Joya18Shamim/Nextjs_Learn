import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL!)
        const connection = mongoose.connection
        connection.on('connected',()=>{
            console.log('MongoDB connected');
        })
        connection.on('error',(err) =>{
            console.log('Mongodb connection error, please make sure dp is up and running:'+err);
            process.exit()
        })
    } catch (error) {
        console.log('Something went wrong in connecting of DB');
        console.log(error)
    }
}