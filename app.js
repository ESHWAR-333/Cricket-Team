const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const app = express();
app.use(express.json());
const initializerDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running successfully on http://localhost:3000");
    });
  } catch (e) {
    response.send(`DB Error ${e.message}`);
    process.exit(1);
  }
};
initializerDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};
//API 1

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `select * from cricket_team order by player_id`;
  const dbResponse = await db.all(getPlayerQuery);
  response.send(
    dbResponse.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});
//API2
app.post("/players/", async (request, response) => {
  const playersDetails = request.body;
  const { playerName, jerseyNumber, role } = playersDetails;
  const createPlayerQuery = `insert into cricket_team 
  ( "player_name",
    "jersey_number",
    "role") values(
       '${playerName}',
        '${jerseyNumber}',
    '${role}'
    );`;
  await db.run(createPlayerQuery);

  response.send("Player Added to Team");
});

//API3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerIdQuery = `select * from cricket_team where player_id=${playerId}`;
  const dbResponse = await db.get(playerIdQuery);
  //   response.send(
  //     dbResponse.map((eachPlayer) => {
  //       convertDbObjectToResponseObject(eachPlayer);
  //     })
  //   );
  response.send(convertDbObjectToResponseObject(dbResponse));
});

//API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updateQuery = `update cricket_team set
  player_name='${playerName}',
  jersey_number='${jerseyNumber}',
  role='${role}'
  where
  player_id=${playerId};
`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});

//API5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `delete from cricket_team where
    player_id=${playerId}`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
