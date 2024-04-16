import * as SQLite from "expo-sqlite";

export function getDbConnection() {
  const cx = SQLite.openDatabase("senseI.db");
  return cx;
}

export async function createTables() {
  return new Promise((resolve, reject) => {
    const query = `CREATE TABLE IF NOT EXISTS Experiments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
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
                observation TEXT
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
                observation
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    let dbCx = getDbConnection();

    dbCx.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [
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

export async function updateExperiment(experiment) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE Experiments SET
                name = ?,
                incubator = ?,
                temperature = ?,
                temperatureLowThreshold = ?,
                temperatureHighThreshold = ?,
                humidity = ?,
                humidityLowThreshold = ?,
                humidityHighThreshold = ?,
                startTimestamp = ?,
                endTimestamp = ?,
                createdTimestamp = ?,
                observation = ?
                WHERE id = ?`;

    let dbCx = getDbConnection();

    dbCx.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [
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
            experiment.id,
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

