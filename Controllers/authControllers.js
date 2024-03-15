import { connect } from "../config/connect.js";
import connectToDatabase from "../config/connectphpadmin.js";
import { comparePassword, hashPassword } from "../Helper/authHelper.js";
import jwt from "jsonwebtoken";
import oracledb from "oracledb";

// export const login = async (req, res) => {
//   try {
//     const studentId = req.body.student_id;
//     const password = req.body.password;

//     // Connect to Oracle Database
//     const connection = await oracledb.getConnection();

//     // Call the custom hash function
//     const hashQuery = `
//       SELECT custom_hash(:studentId, :password) AS lv_hashpassword FROM dual
//     `;

//     const hashBinds = { studentId, password };
//     const hashOptions = { outFormat: oracledb.OUT_FORMAT_OBJECT };

//     const hashResult = await connection.execute(
//       hashQuery,
//       hashBinds,
//       hashOptions
//     );
//     const husisPassword = hashResult.rows[0].lv_hashpassword;

//     // Assuming you have a "users" table in your Oracle Database
//     const loginQuery = `
//       SELECT student_id, student_name
//       FROM students_enrollment
//       WHERE student_id = :studentId AND password = :husisPassword
//     `;

//     const loginBinds = { studentId, husisPassword };
//     const loginOptions = { outFormat: oracledb.OUT_FORMAT_OBJECT };

//     const loginResult = await connection.execute(
//       loginQuery,
//       loginBinds,
//       loginOptions
//     );

//     if (loginResult.rows.length === 0) {
//       return res.status(201).send({
//         success: false,
//         message: "Student ID or Password is incorrect",
//       });
//       //   const code = 201;
//       //   const output = {
//       //     response: {
//       //       code,
//       //       messages: "Student ID or Password is incorrect",
//       //     },
//       //   };
//       //   return res.status(code).send({
//       //     success: true,
//       //     messages: "Student login successfully",
//       //     userdata,
//       //     token,
//       //   });
//     }

//     const userdata = loginResult.rows[0];

//     // Generate JWT token
//     const token = jwt.sign(
//       { studentId: userdata.student_id },
//       "hamdarduniversity",
//       { expiresIn: "1h" }
//     );

//     // const code = 200;
//     // const output = {
//     //   response: {
//     //     messages: "Student login successfully",
//     //   },
//     // };
//     res.status(200).send({
//       success: true,
//       message: "login successfully",
//       userdata,
//       token,
//     });
//     // res.json({ userdata, token, output });
//   } catch (error) {
//     console.error(`Error in login: ${error.message}`);
//     res.status(500).json({ error: error.message });
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (error) {
//         console.error(`Error closing Oracle connection: ${error.message}`);
//       }
//     }
//   }
// };
const pool = connect();

export const login = async (req, res) => {
  try {
    const { student_id, password } = req.body;
    console.log(student_id, password, "id,pass");
    pool.query(
      "SELECT * FROM students WHERE student_id = ?",
      [student_id],
      async (error, results) => {
        if (error) {
          console.error("Error querying the database:", error);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
        console.log(results, "result");
        // Check if the student exists
        if (results.length === 0) {
          return res.status(401).send({
            success: false,
            message: "Invalid credentials",
          });
        }
        const storedPassword = results[0].password;
        const storedUser = {
          student_id: results[0].student_id,
          student_name: results[0].name,
          status: results[0].status,
        };
        const passwordMatch = storedPassword == password;
        const statusactive =
          results[0].status === "Active" || results[0].status === "Confirmed";
        if (passwordMatch) {
          if (statusactive) {
            console.log(statusactive, "statusactive");
            return res.status(200).send({
              success: true,
              message: "Login successful",
              token: "token123",
              user: storedUser,
            });
          } else {
            return res.status(201).send({
              success: false,
              message: "Inactive Student",
            });
          }
        } else {
          // Passwords do not match, authentication failed
          return res.status(401).send({
            success: false,
            message: "Invalid credentials",
          });
        }
      }
    );
  } catch (error) {
    console.log(error, "error");
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getEmployees = async (req, res) => {
  let connection;

  try {
    connection = await connect();

    const query = "SELECT * FROM employees";
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };

    const result = await connection.execute(query, [], options);

    // Process the result and send it in the response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`Error in getEmployees: ${error.message}`);
    res.status(500).json("Internal Server Error");
  } finally {
    // Release the connection back to the pool
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(`Error closing Oracle connection: ${error.message}`);
      }
    }
  }
};

export const getStudentById = async (req, res) => {
  let connection;

  try {
    const studentId = req.params.studentId;

    // Connect to Oracle Database
    const connection = await oracledb.getConnection();

    // Assuming you have a "students_enrollment" table in your Oracle Database
    const query = `
      SELECT student_id, student_name,
      FROM students_enrollment
      WHERE student_id = :studentId
    `;

    const binds = { studentId };
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };

    const result = await connection.execute(query, binds, options);

    if (result.rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Student not found",
      });
    }

    const userdata = result.rows[0];

    res.status(200).send({
      success: true,
      message: "Student data retrieved successfully",
      userdata,
    });
    console.log(connection, "connection");
  } catch (error) {
    console.error(`Error in getStudentById: ${error.message}`);
    res.status(500).send({ error: error.message });
    console.log(connection, "connection");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(`Error closing Oracle connection: ${error.message}`);
      }
    }
  }
};
