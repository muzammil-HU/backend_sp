import oracledb from "oracledb";
import colors from "colors";

const oracleConfig = {
  user: "HAMDARDKARACHI",
  password: "HUsd12cDB2022Init",
  connectString: "172.23.12.221:1521/orcl",
};

// let oracleConnection;

// export const connect = async () => {
//   try {
//     oracleConnection = await oracledb.getConnection(oracleConfig);
//     console.log(
//       `Connected To Oracle Database: ${oracleConnection.oracleServerVersion}`
//         .bgMagenta.white
//     );
//     console.log(
//       oracledb.thin ? "Running in thin mode" : "Running in thick mode"
//     );
//     return oracleConnection;
//   } catch (error) {
//     console.log(
//       oracleConfig.connectString,
//       oracleConfig.user,
//       "string,password"
//     );
//     console.error(`Error connecting to Oracle Database: ${error.message}`);
//     throw error;
//   }
// };

let oraclePool;

export const connect = async () => {
  try {
    if (!oraclePool) {
      oraclePool = await oracledb.createPool(oracleConfig);
      console.log(
        `Connected To Oracle Database: ${oracleConfig.connectString}`.bgMagenta
          .white
      );
      console.log(
        oracledb.thin ? "Running in thin mode" : "Running in thick mode"
      );
    }

    const connection = await oraclePool.getConnection();
    return connection;
  } catch (error) {
    console.error(`Error connecting to Oracle Database: ${error.message}`);
    throw error;
  }
};

export const closePool = async () => {
  if (oraclePool) {
    await oraclePool.close();
    console.log("Oracle Database connection pool closed");
  }
};
