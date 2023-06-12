import mongoose from "mongoose";
import { defaultCatcher } from '../../config/defaultCatcher.js';

const URI = `${ process.env.MONGODB_URI }`

export const dbConnect = async () => {
    mongoose.set('strictQuery', true);
    return mongoose.connect(URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(db => console.log('Mongo DB is connected 🎊'))
        .catch(e => defaultCatcher(e))
}