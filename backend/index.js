const express = require("express");
const app = express();
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const userRoute = require("./routes/user_route.js");
const appRoute = require("./routes/app_routes.js");
const createHTTPError = require("http-errors");
require("dotenv").config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "flow backend api",
      description: "API endpoints for flow backend documented on swagger",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Local server",
      },
    ],
  },
  // looks for configuration in specified directories
  apis: [
    "./routes/*.js",
    "./index.js",
    path.join(__dirname, "./routes/*.js"),
    path.join(__dirname, "./index.js"),
  ],
};
const swaggerSpec = swaggerJsdoc(options);
// function swaggerDocs(app, port) {
//   // Swagger Page
//   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//   // Documentation in JSON format
//   app.get("/api-docs.json", (req, res) => {
//     res.setHeader("Content-Type", "application/json");
//     res.send(swaggerSpec);
//   });
//   console.log(`Docs available at http://localhost:${port}/api-docs`)
//   // log.info(`Docs available at http://localhost:${port}/docs`)
// }
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

/**
 * @openapi
 * /:
 *  get:
 *    tags:
 *      - Home
 *    summary: Home page
 *    description: Retrieve the home page information.
 *    responses:
 *      200:
 *        description: Successfully retrieved the home page.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message indicating the home page response.
 */
app.get("/", (req, res) => {
  res.json({ message: "home page" });
});

app.use("/", userRoute);
app.use("/", appRoute);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  next(createHTTPError(404, "This page does not exist"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

app.listen(port, () => {
  console.log(`listening at port: ${port}`);
  console.log(`home at: http://localhost:${port}`);
  console.log(`Docs available at http://localhost:${port}/api-docs`);
});
