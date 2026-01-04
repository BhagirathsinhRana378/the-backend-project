import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    // origin: 'http://example.com', // replace with your client's origin in production
    Credentials: true
    // why Credentials is set to true here?
    // Setting Credentials to true allows the server to accept cookies and authentication headers from the client, which is essential for maintaining user sessions and secure communication between the client and server.
}))
// why we are using .use(cors()) here?
// We are using app.use(cors()) to enable Cross-Origin Resource Sharing (CORS) for our Express application. This allows our server to accept requests from different origins, which is essential for web applications that interact with APIs hosted on different domains.


app.use(cookieParser())//1
app.use(express.json({limit: '16kb'}))//2
app.use(express.urlencoded({ extended: true,limit: '16kb' }))//2
app.use(express.static('public'))//3

// 1 why are we using cookieParser() here?
// We are using cookieParser() middleware to parse cookies attached to the client request object. This allows us to easily access and manipulate cookies, which are often used for session management, user authentication, and storing user preferences.

// 2 why are we using express.json() and express.urlencoded() here?
// We are using express.json() and express.urlencoded() middleware to parse incoming request bodies in JSON format and URL-encoded format, respectively. This allows us to easily access and manipulate the data sent by clients in POST or PUT requests.

// 3 why are we using express.static('public') here?
// We are using express.static('public') to serve static files such as HTML, CSS, JavaScript, and images from the 'public' directory. This allows clients to access these files directly via HTTP requests. 


// routes would be here
import userRoutes from './routes/user.routes.js';

//routes declaration

app.use('/api/v1/users', userRoutes);
// now userRoutes will be used for any route starting with /api/v1/users













export { app }