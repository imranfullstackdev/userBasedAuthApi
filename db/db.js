const pool = require("pg").Pool;
const PooL = new pool({
  user: "postgres",
  password: "lmvit123",
  database: "cruddb2",
  port: "5432",
});
module.exports = PooL;
