import pool from "./db/db.js";

process.loadEnvFile();

async function test() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS resultado");
    console.log("Conexión OK:", rows);
    process.exit(0);
  } catch (error) {
    console.error("Error de conexión:", error.message);
    process.exit(1);
  }
}

console.log("iniciando test...");

test();