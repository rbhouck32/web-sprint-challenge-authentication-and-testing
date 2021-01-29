const router = require("express").Router();

const bcrypt = require("bcryptjs");

const { isValid } = require("../users/services.js");
const { generateToken } = require("./auth-services.js");

const Users = require("../users/users-model.js");

router.post("/register", async (req, res) => {
  const credentials = req.body;

  try {
    if (isValid(credentials)) {
      const rounds = process.env.BCRYPT_ROUNDS || 9;
      const hash = bcrypt.hashSync(credentials.password, rounds);
      credentials.password = hash;
      const newUser = await Users.add(credentials);

      res.status(201).json({ message: "Success!", newUser });
    } else {
      res.status(400).json({ message: "username and password required" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const allegedUser = await Users.findBy({ username });
    if (isValid(req.body)) {
      if (
        allegedUser.username &&
        bcrypt.compareSync(password, allegedUser.password)
      ) {
        const token = generateToken(allegedUser);
        res
          .status(200)
          .json({ message: `Welcome!, ${allegedUser.username}`, token });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    } else {
      res.status(400).json({ message: "username and password are required" });
    }
  } catch (err) {
    next();
  }
});

module.exports = router;
