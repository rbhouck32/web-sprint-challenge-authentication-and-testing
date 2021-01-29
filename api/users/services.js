function isValid(body) {
  return Boolean(
    body.username && body.password && typeof body.password === "string"
  );
}
module.exports = {
  isValid,
};
// force a commit
