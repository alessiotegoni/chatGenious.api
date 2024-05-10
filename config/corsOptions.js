dotenv.config();
import dotenv from "dotenv";

const allowedOrigins = [
  process.env.NODE_ENV === "dev"
    ? "http://localhost:5173"
    : "https://chatgenious.onrender.com", // production
];

console.log(allowedOrigins);

export const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
