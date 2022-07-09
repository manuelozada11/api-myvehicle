import mongoose from "mongoose";

const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.pqm2v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

export const dbConnect = async () => {
    return mongoose.connect(URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(db => console.log('Mongo DB is connected 🎊'))
}