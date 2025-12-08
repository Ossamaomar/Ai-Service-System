import express, { type Application, type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { parse } from "qs";
import router from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
// import rateLimit from "express-rate-limit";

const app: Application = express();

// const limiter = rateLimit({
//   limit: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, try again in an hour!",
// });

// Set secure HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Applying rate limit
// app.use('/api', limiter);

// Body parser reading data from the body into req.body 
app.use(express.json({ limit: '10kb' }));

// Loading any static files that mught be used
app.use(express.static(`${__dirname}/public`));

// Parsing nested queries
app.set('query parser', (str: string) => parse(str));

// Adding the request time to all requests
app.use((req: any, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});



// Router mounting
app.use('/api/v1/', router);


// // 2. Default unhandled routes handler
// app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
//   next(new AppError(`Cannot find ${req.originalUrl} route.`, 404));
// });

// // Global error handler
// app.use(globalErrorHandler);
app.use(errorHandler);

export default app;
