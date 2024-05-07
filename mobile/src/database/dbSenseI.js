import * as SQLite from "expo-sqlite";

export function getDbConnection() {
  const cx = SQLite.openDatabase("senseI.db");
  return cx;
}

export async function createTables() {
  return new Promise((resolve, reject) => {
    const query = `CREATE TABLE IF NOT EXISTS Experiments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                serverId TEXT,
                name TEXT,
                incubator TEXT,
                temperature REAL,
                temperatureLowThreshold REAL,
                temperatureHighThreshold REAL,
                humidity REAL,
                humidityLowThreshold REAL,
                humidityHighThreshold REAL,
                startTimestamp INTEGER,
                endTimestamp INTEGER,
                createdTimestamp INTEGER,
                observation TEXT,
                owner TEXT
          )`;

    const query2 = "DROP TABLE IF EXISTS Experiments";
    const query3 = "DELETE FROM Experiments";
    
    let dbCx = getDbConnection();

    dbCx.transaction(
      (tx) => {
        tx.executeSql(query);
        resolve(true);
      },
      (error) => {
        console.log(error);
        reject(error);
      }
    );
  });
}

export async function getExperiments() {
  return new Promise((resolve, reject) => {
    let dbCx = getDbConnection();
    dbCx.transaction((tx) => {
      let query = "select * from Experiments";
      tx.executeSql(query, [], (tx, registros) => {
        var retorno = [];
        for (let i = 0; i < registros.rows.length; i++) {
          retorno.push(registros.rows.item(i));
        }
        resolve(retorno);
      });
    });
  });
}

export async function insertExperiment(experiment) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Experiments (
                serverId,
                name,
                incubator,
                temperature,
                temperatureLowThreshold,
                temperatureHighThreshold,
                humidity,
                humidityLowThreshold,
                humidityHighThreshold,
                startTimestamp,
                endTimestamp,
                createdTimestamp,
                observation,
                owner
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    let dbCx = getDbConnection();

    dbCx.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [
            experiment.serverId,
            experiment.name,
            experiment.incubator,
            experiment.temperature,
            experiment.temperatureLowThreshold,
            experiment.temperatureHighThreshold,
            experiment.humidity,
            experiment.humidityLowThreshold,
            experiment.humidityHighThreshold,
            experiment.startTimestamp,
            experiment.endTimestamp,
            experiment.createdTimestamp,
            experiment.observation,
            experiment.owner
          ],
          (_, result) => {
            resolve(result);
          }
        );
      },
      (error) => {
        console.log(error);
        reject(error);
      }
    );
  });
}

export async function updateExperiment(id, fieldsToUpdate) {
  return new Promise((resolve, reject) => {
    let query = `UPDATE Experiments SET `;
    let values = [];
    for (let key in fieldsToUpdate) {
      query += `${key} = ?, `;
      values.push(fieldsToUpdate[key]);
    }
    query = query.slice(0, -2); // remove last comma and space
    query += ` WHERE id = ?`;
    values.push(id);

    let dbCx = getDbConnection();
    console.log("query -> " + query);
    console.log("values -> " + JSON.stringify(values));
    dbCx.transaction(
      (tx) => {
        tx.executeSql(
          query,
          values,
          (_, result) => {
            console.log("update result -> " + JSON.stringify(result));
            resolve(result);
          },
          (error) => {
            console.log("update error -> " + JSON.stringify(error));
            reject(error);
          }
        );
      }
    );
  });
}

export async function deleteExperiment(id) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM Experiments WHERE id = ?`;

    let dbCx = getDbConnection();

    dbCx.transaction(
      (tx) => {
        tx.executeSql(query, [id], (_, result) => {
          resolve(result);
        });
      },
      (error) => {
        console.log(error);
        reject(error);
      }
    );
  });
}

