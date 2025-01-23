import express from "express";

//Other imports
import errorsHandler from "./middlewares/errorsHandler.js";
import notFound from "./middlewares/notFound.js";
import corsPolicy from "./middlewares/corsPolicy.js"
import moviesRouter from "./routes/moviesRouter.js";
import reviewsRouter from "./routes/reviewsRouter.js";
import cors from "cors"
// create a server instance
const app = express();

// set costant to port
const port = process.env.PORT || 4000;

app.use(express.static("public"));

app.use(cors())

// registro il body-parser per "application/json"
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home Page");
});

//other routes
app.use("/api/movies", moviesRouter);
app.use("/api/reviews", reviewsRouter);

app.use(errorsHandler);

app.use("/*", notFound);

//server must listen on your host and your port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
