import { db } from "../db/connect.js";

export const usersCollection = db.collection("users");
export const donationsCollection = db.collection("donations");
// export const requestsCollection = db.collection("requests");
// export const reviewsCollection = db.collection("reviews");
// export const transactionsCollection = db.collection("transactions");
// export const roleRequestsCollection = db.collection("roleRequests");
// export const reportsCollection = db.collection("reports");
