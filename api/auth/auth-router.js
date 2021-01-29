const router = require("express").Router();

const bcrypt = require("bcryptjs");

const { isValid } = require("../users/services.js");
const { generateToken } = require("./auth-services.js");

const Users = require("../users/users-model.js");
const { orWhereNotExists } = require("../../data/dbConfig.js");

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
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
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
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
