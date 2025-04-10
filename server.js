const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./database/sequelize');
const sellerRouter = require('./router/sellerRouter');
const adminRouter = require('./router/adminRouter');
const productRouter = require('./router/productRouter');
const categoryRouter = require('./router/category');

const secret = process.env.EXPRESS_SESSION_SECRET;
const session = require('express-session');
const PORT = process.env.PORT;
const passport = require('passport');
require('./middlewares/passport');
const swaggerJSDoc = require('swagger-jsdoc');

const kycRouter = require('./router/kycRouter');





const swaggerUi = require('swagger-ui-express')


const app = express();


// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Swagger Setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Campus trade documentation',
    version: '1.0.0',
    description: 'Documentation for Campus trade API for TCA Cohort 5',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Campus Trade',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  "components": {
      "securitySchemes": {
          "BearerAuth": {
              "type": "http",
              "scheme": "bearer",
              "bearerFormat": "JWT"
          }
      }
    },

  
  security: [{ BearerAuth: [] }],
  servers: [
      {
          url: 'https://campustrade-kku1.onrender.com',
          description: 'Production server',
      },
      {
          url: 'http://localhost:1709',
          description: 'Development server',
      },

    ],
  };
  

  const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./router/*.js', 'server.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
* @swagger
* /:
*   get:
*     summary: The Home Page of the app
*     description: Returns a welcome message from Campus Trade.
*     security: []  # This ensures the route is public (no authentication required)
*     tags:
*       - Home
*     responses:
*       200:
*         description: Successfully loads the home page.
*         content:
*           text/plain:
*             schema:
*               type: string
*               example: Welcome to the Campus Trade Home Page
*/


app.get('/', (req, res) => {
    res.send('Welcome to the Campus Trade Home Page');
});
app.use((error, req, res, next) => {

  if (error) {
    
    return res.status(400).json({ message: error.message })
  }
})

app.use('/api/v1', sellerRouter);
app.use('/api/v1', adminRouter)
app.use('/api/v1', productRouter)
app.use('/api/v1', categoryRouter)
app.use('/api/v1', kycRouter)


const server = async()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    };
  
server();


app.listen(PORT,()=>{
    console.log(`Server is listening to PORT: ${PORT}`);
})

