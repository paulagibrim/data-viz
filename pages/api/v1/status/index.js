import database from "infra/database.js";

async function status(request, response) {
  // const result = await database.query("SELECT 1+1;");
  const updatedAt = new Date().toISOString();

  const databaseVersionJson = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionJson.rows[0].server_version;

  const databaseMaxConnectionsJson = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsJson.rows[0].max_connections;

  // // OBS.: Aqui eu fiz assim, mas o Filipe fez diferente (dia 20 - PL4)
  // // Se der erro, verificar aqui.
  // const databaseActiveConnectionsJson = await database.query(
  //   "SELECT count(*)::int AS active_connections FROM pg_stat_activity WHERE state = 'active';",
  // );

  const databaseName = process.env.POSTGRES_DB;
  const databaseActiveConnectionsJson = await database.query({
    text: "SELECT count(*)::int AS active_connections FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseActiveConnectionsValue =
    databaseActiveConnectionsJson.rows[0].active_connections;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        active_connections: databaseActiveConnectionsValue,
      },
    },
  });
}

export default status;
