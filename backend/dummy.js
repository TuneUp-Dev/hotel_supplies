const admin = require("firebase-admin");

const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

const formatString = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\//g, "@")
    .replace(/[^a-z0-9-@]/g, "");

// Mock product data with nested products
const productData = {
  "Hospitality Linen & Equipment": {
    "Bedroom Linen": [
      {
        name: "Bed Sheet",
        products: [
          {
            name: "Bed Sheet 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQtanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
            productImages: [
              "https://example.com/image1.jpg",
              "https://example.com/image2.jpg",
            ],
          },
          {
            name: "Bed Sheet 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQtanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
            productImages: [
              "https://example.com/image3.jpg",
              "https://example.com/image4.jpg",
            ],
          },
        ],
      },
      {
        name: "Duvet / Duvet Covers",
        products: [
          {
            name: "Duvet 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Duvet 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Fitted Sheet",
        products: [
          {
            name: "Fitted Sheet 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Fitted Sheet 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Mattress Protector",
        products: [
          {
            name: "Mattress Protector 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Mattress Protector 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Pillows / Pillow Covers",
        products: [
          {
            name: "Pillow 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Pillow 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Pillow Protector",
        products: [
          {
            name: "Pillow Protector 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Pillow Protector 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Hotel Blanket",
        products: [
          {
            name: "Hotel Blanket 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Hotel Blanket 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Bathroom Essentials": [
      {
        name: "Bath Towel",
        products: [
          {
            name: "Bath Towel 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Bath Towel 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Hand Towel",
        products: [
          {
            name: "Hand Towel 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Hand Towel 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Face Towel",
        products: [
          {
            name: "Face Towel 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Face Towel 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Bath Sheet",
        products: [
          {
            name: "Bath Sheet 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Bath Sheet 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Bath Mat",
        products: [
          {
            name: "Bath Mat 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Bath Mat 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Bath Robe",
        products: [
          {
            name: "Bath Robe 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Bath Robe 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Pool Towel",
        products: [
          {
            name: "Pool Towel 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Pool Towel 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Room Comfort & Accessories": [
      {
        name: "Room Slipper",
        products: [
          {
            name: "Room Slipper 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Room Slipper 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Cloth Hangers",
        products: [
          {
            name: "Cloth Hangers 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Cloth Hangers 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Dining & Banquet Linen": [
      {
        name: "Table Cloth",
        products: [
          {
            name: "Table Cloth 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Table Cloth 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Napkin",
        products: [
          {
            name: "Napkin 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Napkin 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Placemat",
        products: [
          {
            name: "Placemat 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Placemat 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Furniture & Equipment": [
      {
        name: "Banquet Furniture",
        products: [
          {
            name: "Banquet Furniture 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Banquet Furniture 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Pool Chair",
        products: [
          {
            name: "Pool Chair 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Pool Chair 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Rollaway Beds",
        products: [
          {
            name: "Rollaway Bed 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Rollaway Bed 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Trolleys and Carts",
        products: [
          {
            name: "Trolley 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Trolley 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Coffee Machine",
        products: [
          {
            name: "Coffee Machine 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Coffee Machine 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
  },
  "Air Fresheners & Oil Diffusers": {
    "Aerosol Air Fresheners & Dispensers": [
      {
        name: "Aerosol Air Fresheners",
        products: [
          {
            name: "Aerosol Air Freshener 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Aerosol Air Freshener 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Dispensers",
        products: [
          {
            name: "Dispenser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Dispenser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Refill Cans",
        products: [
          {
            name: "Refill Can 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Refill Can 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Manual Air Freshener",
        products: [
          {
            name: "Manual Air Freshener 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Manual Air Freshener 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Oxygen Air Fresheners & Diffusers": [
      {
        name: "Oxygen Air Fresheners",
        products: [
          {
            name: "Oxygen Air Freshener 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Oxygen Air Freshener 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Oxygen Supreme",
        products: [
          {
            name: "Oxygen Supreme 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Oxygen Supreme 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Oxygen Pro Dispensers",
        products: [
          {
            name: "Oxygen Pro Dispenser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Oxygen Pro Dispenser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Viva!e Dispenser",
        products: [
          {
            name: "Viva!e Dispenser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Viva!e Dispenser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Oil Diffusers & Fragrances": [
      {
        name: "Mini Oil Diffusers",
        products: [
          {
            name: "Mini Oil Diffuser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Mini Oil Diffuser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Plug-in Oil Diffuser",
        products: [
          {
            name: "Plug-in Oil Diffuser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Plug-in Oil Diffuser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Mini Wall Mounted Diffuser",
        products: [
          {
            name: "Mini Wall Mounted Diffuser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Mini Wall Mounted Diffuser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Medium Size Diffuser",
        products: [
          {
            name: "Medium Size Diffuser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Medium Size Diffuser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Large Area Oil Diffuser",
        products: [
          {
            name: "Large Area Oil Diffuser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Large Area Oil Diffuser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Refill Cartridges",
        products: [
          {
            name: "Refill Cartridge 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Refill Cartridge 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Fragrance Range",
        products: [
          {
            name: "Fragrance 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Fragrance 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Coverage-Based Diffusers": [
      {
        name: "Small Coverage Diffuser",
        products: [
          {
            name: "Small Coverage Diffuser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Small Coverage Diffuser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Small Coverage Diffuser 3",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Small Coverage Diffuser 4",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Medium Coverage Diffuser",
        products: [
          {
            name: "Medium Coverage Diffuser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Medium Coverage Diffuser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Large Coverage Diffuser",
        products: [
          {
            name: "Large Coverage Diffuser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Large Coverage Diffuser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "A/C Duct Mounted Diffuser",
        products: [
          {
            name: "A/C Duct Mounted Diffuser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "A/C Duct Mounted Diffuser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
  },
  "Hygiene Products & Supplies": {
    "Guest Amenities": [
      {
        name: "Shampoo",
        products: [
          {
            name: "Shampoo 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Shampoo 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Bath Gel",
        products: [
          {
            name: "Bath Gel 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Bath Gel 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Body Lotion",
        products: [
          {
            name: "Body Lotion 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Body Lotion 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Hair Conditioner",
        products: [
          {
            name: "Hair Conditioner 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Hair Conditioner 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Dental / Shaving Kit",
        products: [
          {
            name: "Dental Kit 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Shaving Kit 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Soap",
        products: [
          {
            name: "Soap 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Soap 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Soap & Sanitization Dispensers": [
      {
        name: "Wall Mounted Dispensers",
        products: [
          {
            name: "Wall Mounted Dispenser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Wall Mounted Dispenser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Foam Soap",
        products: [
          {
            name: "Foam Soap 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Foam Soap 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Seat Sanitizer",
        products: [
          {
            name: "Seat Sanitizer 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Seat Sanitizer 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Hand Sanitizer",
        products: [
          {
            name: "Hand Sanitizer 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Hand Sanitizer 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Shampoo & Shower Gel Dispenser",
        products: [
          {
            name: "Shampoo Dispenser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Shower Gel Dispenser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Paper Products & Dispensers": [
      {
        name: "Hand Towel Dispenser",
        products: [
          {
            name: "Hand Towel Dispenser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Hand Towel Dispenser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Kitchen Towel Dispenser",
        products: [
          {
            name: "Kitchen Towel Dispenser 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Kitchen Towel Dispenser 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Tissue Boxes",
        products: [
          {
            name: "Tissue Box 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Tissue Box 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Personal Hygiene Products": [
      {
        name: "Baby Care Items",
        products: [
          {
            name: "Baby Care Item 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Baby Care Item 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Feminine Hygiene Items",
        products: [
          {
            name: "Feminine Hygiene Item 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Feminine Hygiene Item 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Cleaning & Consumer Products": [
      {
        name: "Hand Wash Liquid",
        products: [
          {
            name: "Hand Wash Liquid 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Hand Wash Liquid 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Dish Wash Liquid",
        products: [
          {
            name: "Dish Wash Liquid 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Dish Wash Liquid 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Laundry Detergent",
        products: [
          {
            name: "Laundry Detergent 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Laundry Detergent 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Fabric Softener",
        products: [
          {
            name: "Fabric Softener 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Fabric Softener 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Glass Cleaner",
        products: [
          {
            name: "Glass Cleaner 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Glass Cleaner 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "All-Purpose Cleaner",
        products: [
          {
            name: "All-Purpose Cleaner 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "All-Purpose Cleaner 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
  },
  "Environmental Simulation & Lab Equipment": {
    "Testing Chambers": [
      {
        name: "Temperature & Humidity Test Chamber",
        products: [
          {
            name: "Test Chamber 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Test Chamber 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Rapid Temperature Test Chamber",
        products: [
          {
            name: "Rapid Test Chamber 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Rapid Test Chamber 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Walk-in Chambers with Intelligent Control System",
        products: [
          {
            name: "Walk-in Chamber 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Walk-in Chamber 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Shock Test Chamber",
        products: [
          {
            name: "Shock Test Chamber 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Shock Test Chamber 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Thermal Shock Chambers": [
      {
        name: "2-Zone Thermal Shock Chamber",
        products: [
          {
            name: "2-Zone Chamber 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "2-Zone Chamber 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "3-Zone Thermal Shock Chamber",
        products: [
          {
            name: "3-Zone Chamber 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "3-Zone Chamber 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
  },
  "Technology & Software": {
    "Wireless Solutions": [
      {
        name: "Wireless Calling System (for restaurants & cafes)",
        products: [
          {
            name: "Wireless Calling System 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Wireless Calling System 2",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "Pest Control Solutions": [
      {
        name: "Insect Control Equipment (Zapper & Glue Board)",
        products: [
          {
            name: "Insect Zapper 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "Glue Board 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
    "ERP & Business Software": [
      {
        name: "ERP Implementation & Support",
        products: [
          {
            name: "ERP Implementation 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "ERP Support 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
      {
        name: "Custom Software & App Development",
        products: [
          {
            name: "Custom Software 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
          {
            name: "App Development 1",
            imageUrl:
              "https://imgs.search.brave.com/aj6hkHa4IbDVnxU0vKiztS2GRtlBVgYCbHICqynkULg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEyLzUwLzY4LzU3/LzM2MF9GXzEyNTA2/ODU3NzhfeEJJMUx1/RnhKTm5KYXdSaUZ3/bnhlRVpjd0Q0dVpj/RVguanBn",
          },
        ],
      },
    ],
  },
};

// Function to add product data to Firestore
async function addProductData() {
  try {
    const batch = db.batch(); // Use batch for efficiency

    for (const [category, subcategories] of Object.entries(productData)) {
      const categoryId = formatString(category);
      console.log(`Processing category: ${categoryId}`);

      // 🔹 Create Category Document
      const categoryRef = db.collection("Categories").doc(categoryId);
      batch.set(categoryRef, { id: categoryId, name: category });

      for (const [subcategory, products] of Object.entries(subcategories)) {
        const subcategoryId = formatString(subcategory);
        console.log(`  Processing subcategory: ${subcategoryId}`);

        // 🔹 Create Subcategory Document
        const subcategoryRef = categoryRef
          .collection("SubCategories")
          .doc(subcategoryId);
        batch.set(subcategoryRef, { id: subcategoryId, name: subcategory });

        for (const productGroup of products) {
          const productTypeId = formatString(productGroup.name); // Product type ID (e.g., "bed-sheet")
          console.log(`    Processing product type: ${productTypeId}`);

          // 🔹 Create Product Type Document
          const productTypeRef = subcategoryRef
            .collection("Products")
            .doc(productTypeId);

          // Prepare the products array with productImages
          const productsArray = productGroup.products.map((product) => ({
            name: product.name,
            imageUrl: product.imageUrl || null, // Avoid undefined values
            productImages: product.productImages || [], // Add productImages array
          }));

          // Set the product type document with the products array
          batch.set(productTypeRef, {
            id: productTypeId,
            name: productGroup.name,
            products: productsArray,
          });
        }
      }
    }

    await batch.commit(); // Commit batch updates
    console.log("✅ All product data added successfully!");
  } catch (error) {
    console.error("❌ Error adding data:", error);
  }
}

// Run the function
addProductData();
