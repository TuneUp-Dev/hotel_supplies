const allowedOrigins = [
  "https://hotel-supplies.vercel.app",
  "https://www.hotel-supplies.vercel.app",
  "http://localhost:3000",
];

module.exports = {
  origin: allowedOrigins,
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type"],
};
