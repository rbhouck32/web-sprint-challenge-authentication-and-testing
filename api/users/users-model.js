const db = require("../../database/dbConfig.js");

module.exports = {
  add,
  find,
  findById,
  findBy,
};

async function add(user) {
  const [id] = await db("users").insert(user, "id");
  return findById(id);
}

function findBy(filter) {
  return db("users").where(filter).first();
}

function find() {
  return db("users");
}

function findById(id) {
  return db("users").where({ id }).first();
}
