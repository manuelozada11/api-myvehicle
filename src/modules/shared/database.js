import mongoose from "mongoose";

const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@ceccluster.pqm2v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

// mongoose.set('useCreateIndex', true)
mongoose.connect(URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
        // useFindAndModify: false
    })
    .then(db => console.log('DB is connected 🔐'))
    .catch(err => console.log(`dbError: ${err}`))

export default mongoose