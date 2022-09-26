const validator = require("email-validator");

module.exports = {
  validateRegistration: (req, res, next) => {
    const { email, pass1, pass2, gender, age, city } = req.body;
    // validation Errors
    let validationError = [];

    // email validation
    if (!validator.validate(email)) {
      let erorrType = {
        value: true,
        text: "bad Email",
        kind: "email",
      };

      validationError.push(...validationError, erorrType);
    }
    // gender validation
    if (gender === "") {
      erorrType = {
        value: true,
        text: "Please select gender",
        kind: "gender",
      };
      validationError.push(...validationError, erorrType);
    }
    // age validation
    if (age < 18 || age > 100) {
      erorrType = {
        value: true,
        text: "Wrong age. Must be 18+",
        kind: "age",
      };
      validationError.push(...validationError, erorrType);
    }
    //city validation
    if (!city) {
      erorrType = {
        value: true,
        text: "Please provide city",
        kind: "city",
      };
      validationError.push(...validationError, erorrType);
    }
    // pass validation
    if (pass1 !== pass2 || pass1 === "" || pass2 === "") {
      erorrType = {
        value: true,
        text: "Password do not match or was not entered",
        kind: "pass",
      };
      validationError.push(...validationError, erorrType);
    }

    // Additional Pass validation(need to uncoment)
    // let hasUpper = false;
    // let hasNumber = false;

    // let pasnoNnumber = "";

    // for (let i = 0; i < password.length; i++) {
    //   if (!Number(password[i])) pasnoNnumber += password[i];

    //   if (Number(password[i]) || Number(password[i] === 0)) hasNumber = true;
    // }
    // for (let i = 0; i < pasnoNnumber.length; i++) {
    //   if (pasnoNnumber[i] === pasnoNnumber[i].toUpperCase()) hasUpper = true;
    // }

    // if (!hasUpper) validationError = "pass need to have Upper";
    // if (!hasNumber) validationError = "pass need to have number";

    if (validationError.length > 0)
      return res.send({ error: true, message: validationError });

    next();
  },
};
