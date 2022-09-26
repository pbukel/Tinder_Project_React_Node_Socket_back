const { getUsernames } = require("./dataModule");

module.exports = {
  validateUsername: (req, res, next) => {
    const { username } = req.body;

    let validationError = [];

    async function isName() {
      return await getUsernames(username);
    }
    isName()
      .then((res) => {
        if (res) {
          let erorrType = {
            value: true,
            text: "This username already taken",
            kind: "username",
          };
          validationError.push(...validationError, erorrType);
        }
        if (username === "") {
          let erorrType = {
            value: true,
            text: "Username cant be blanck!",
            kind: "username",
          };
          validationError.push(...validationError, erorrType);
        }
      })
      .then(() => {
        if (validationError.length > 0)
          return res.send({ error: true, message: validationError });
        else {
          next();
        }
      });
  },
};
