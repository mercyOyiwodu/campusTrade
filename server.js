const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./database/sequelize');
const sellerRouter = require('./router/sellerRouter');
const adminRouter = require('./router/adminRouter');
const productRouter = require('./router/productRouter');
const categoryRouter = require('./router/category');
const session = require('express-session');
const passport = require('passport');
require('./middlewares/passport');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 6780;
const secret = process.env.EXPRESS_SESSION_SECRET;

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
          url: '',
          description: 'https://campustrade-kku1.onrender.com',
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
    apis: ['./routes/*.js', 'server.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: The Home Page of the app
 *     description: Returns a welcome message from Cloud View Hotel.
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
 *               example: Welcome to the Cloud View Hotel Home Page
 */

app.get('/', (req, res) => {
    res.send('Welcome to the Cloud View Hotel Home Page');
});
app.use((error, req, res, next) => {
    if (error) {
        return res.status(400).json({ message: error.message })
    }
})

app.use('/api/v1', adminRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1', sellerRouter);
app.use('/api/v1', productRouter);
const server = async () => {
  try {
      await sequelize.authenticate();
      console.log('Connection to database has been established successfully.');
  } catch (error) {
      console.error('Unable to connect to the database:', error.message);
  }
};

server();
app.listen(PORT, () => {
    console.log(`Server is listening to PORT: ${PORT}`)
})