const express = require('express')
require('dotenv').config()
const cors = require('cors');
const morgan = require('morgan')
const sequelize = require('./database/sequelize')
const sellerRouter = require('./router/sellerRouter');
const adminRouter = require('./router/adminRouter');

const secret = process.env.Express_session_secret;
const session = require('express-session')
const PORT = process.env.PORT;
const passport = require('passport');
require('./middlewares/passport')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
// const productRouter = require('./router/productRouter'


const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));
app.use(morgan('dev'));
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

// for swagger documentation
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Swagger Documentation',
    version: '1.0.0',
    description:
      'Swagger docs usage',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Campus Trade',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  "components":{
      "securitySchema":{
          "BearerAuth":{
              "type": "http",
              "schema": "bearer",
              "bearerFormat": "JWT"
          }
      }
  },
  security:[{BearerAuth: [] }],
  servers: [
    {
      // for production  it is from render
      url: 'http://localhost:4444',
      description: 'Production server',
    },
    {
      // for development it is from localhost url 
      url: 'http://localhost:1709',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', sellerRouter);
app.use('/api/v1', adminRouter)

app.use('/', (req, res) => {
  res.send('Welcome To Campus Trade')
  
})

app.use((error, req, res, next) => {
  if(error){
     return res.status(400).json({message:  error.message})
  }
  next()
})

const server = async()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
server()


app.listen(PORT,()=>{
    console.log(`Server is listening to PORT: ${PORT}`);
// app.use(express.json())
// app.use("api/v1",productRouter)

// app.listen(port,()=>{
//     console.log(`My Server Is Up And Running On Port ${port}`);
    
// })