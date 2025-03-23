const allowedOrigins = [
  "https://hotel-supplies-delta.vercel.app",
  "https://www.hotel-supplies-delta.vercel.app",
  "https://hotel-supplies-backend.vercel.app",
  "https://www.hotel-supplies-backend.vercel.app",
  "http://localhost:3000",
];

module.exports = {
  origin: allowedOrigins,
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type"],
};
