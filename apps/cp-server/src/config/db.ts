/* eslint-disable no-console */
import mongoose from "mongoose";

import { getKeys } from "./keys";

const { mongoUri, appEnv } = getKeys();

export class DB {
  static async connect() {
    try {
      const dbUrl = `${mongoUri}/community-server-${appEnv}`;
      await mongoose.connect(dbUrl);

      console.log("Connected to Database Successfully");
    } catch (err) {
      console.error({ err });
      throw new Error(`dbErr: ${err}`);
    }
  }

  static async disconnect() {
    try {
      await mongoose.connection.close();
      console.log("Database connection closed.");
    } catch (err) {
      console.error("Error closing database connection:", err);
    }
  }
}
