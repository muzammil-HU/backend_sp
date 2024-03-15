import mysql from "mysql";
import colors from "colors";

const connectToDatabase = () => {
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "studentportal",
  });

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error(err.stack, "Error connecting to the database:".bgRed.white);
      return;
    }

    console.log("Connected to the database!".bgMagenta.white);

    // SQL query to create a database named facility if it doesn't exist
    // connection.query(
    //   "CREATE DATABASE IF NOT EXISTS facility",
    //   function (err, result) {
    //     if (err) {
    //       console.error("Error creating database:", err.stack);
    //       return;
    //     }

    //     console.log("Database 'facility' is created");
    //   }
    // );

    // Release the connection back to the pool
    connection.release();
  });

  return pool;
};

export default connectToDatabase;
