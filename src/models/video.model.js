import mongoose, {Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
//what is mongoose aggregate paginate v2
//it is a plugin that allows us to paginate the results of an aggregate query
//what it aggratee query
//an aggregate query is a query that allows us to perform complex operations on the data in our database
//such as grouping, sorting, and filtering
//why do we need pagination
//pagination is important because it allows us to limit the number of results returned by a query
//this is especially important when dealing with large datasets
//without pagination, a query could return thousands or even millions of results, which can be slow and inefficient
//by using pagination, we can limit the number of results returned and improve the performance of our application


const videoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    videofile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    ispublished:{
        type:Boolean,
        default:false
    },
    owener:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})





export const Video = mongoose.model("Video", videoSchema)