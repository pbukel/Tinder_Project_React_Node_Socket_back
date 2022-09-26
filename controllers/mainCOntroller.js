const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const regSchema = require("../schemas/regSchema");

mongoose
  .connect(process.env.MONGO_KEY)
  .then((res) => {
    console.log("conected");
  })
  .catch((e) => {
    console.log("error");
  });
// function pass protect - hashing
async function hashPass(plain) {
  const hashPass = await bcrypt.hash(plain, 10);
  return hashPass;
}
//User registration function
async function regUser(obj) {
  const hashedPass = await hashPass(obj.pass1);
  const item = new regSchema();
  item.userName = obj.username;
  item.email = obj.email;
  item.pass = hashedPass;
  item.age = obj.age;
  item.gender = obj.gender;
  item.city = obj.city;
  item
    .save()
    .then((result) => {
      // console.log(result);
    })
    .catch((e) => {
      console.log(e);
    });
}

module.exports = {
  register: (req, res) => {
    regUser(req.body);
    res.send({ error: false, message: "registracija sekminga" });
  },
  login: async (req, res) => {
    // console.log(week);
    const { userName, password } = req.body;

    const user = await regSchema.findOne({ userName });
    // console.log(user);
    let allUser = await regSchema.find(
      { userName: { $ne: userName } },
      { pass: 0 }
    );

    if (user) {
      // bcryp pass compare function
      compare = await bcrypt.compare(password, user.pass);
      if (!compare)
        return res.send({
          error: true,
          message: {
            value: true,
            text: "Wrong username or password",
          },
        });
    }

    if (!user)
      return res.send({
        error: true,
        message: {
          value: true,
          text: "Wrong username or password",
        },
      });
    const newUser = {
      userName: user.userName,
      age: user.age,
      gender: user.gender,
      city: user.city,
      img: user.img,
      myLikes: user.myLikes,
      whoLikesme: user.whoLikesme,
      myDislikes: user.myDislikes,
      whoDislikesMe: user.whoDislikesMe,
    };

    req.session.user = newUser;

    res.send({
      data: newUser,
      allUser,
      error: false,
      message: "all OK",
    });
  },
  autoLogin: async (req, res) => {
    if (req.session.user) {
      const { userName } = req.session.user;
      const user = await regSchema.findOne({ userName });
      let allUser = await regSchema.find(
        { userName: { $ne: userName } },
        { pass: 0 }
      );

      const newUser = {
        userName: user.userName,
        age: user.age,
        gender: user.gender,
        city: user.city,
        img: user.img,
        myLikes: user.myLikes,
        whoLikesme: user.whoLikesme,
        myDislikes: user.myDislikes,
        whoDislikesMe: user.whoDislikesMe,
      };

      return res.send({
        newUser,
        allUser,
        error: false,
        message: "autoLoged",
      });
    }

    res.send({
      data: null,
      error: true,
      message: "noAutoLogInfo",
    });
  },
  logout: async (req, res) => {
    delete req.session.user;
    res.send({
      data: null,
      error: false,
      message: "autoLogRemoved",
    });
  },
  addPicture: async (req, res) => {
    const { img, userName } = req.body;

    await regSchema.findOneAndUpdate({ userName }, { $addToSet: { img: img } });
    const user = await regSchema.findOne({ userName });
    const newUser = {
      userName: user.userName,
      age: user.age,
      gender: user.gender,
      city: user.city,
      img: user.img,
      myLikes: user.myLikes,
      whoLikesme: user.whoLikesme,
      myDislikes: user.myDislikes,
      whoDislikesMe: user.whoDislikesMe,
    };

    req.session.user = newUser;

    res.send({
      data: newUser,
      error: false,
      message: "all OK",
    });
  },
  getUsers: async (req, res) => {
    const { userName } = req.body;
    // to do not send pass, or other key :regSchema.find({}, { pass: 0 }); use 0 or 1 with key.
    // now pass is not sent to back.
    let allUser = await regSchema.find(
      { userName: { $ne: userName } },
      { pass: 0 }
    );

    res.send({
      data: allUser,
      error: false,
      message: "all OK",
    });
  },

  filterUsers: async (req, res) => {
    const { age, city, gender, userName } = req.body;
    // split age as it arriwes from Frontas two strings.
    const words = age.split(",");

    const filtered = await regSchema.find(
      {
        userName: { $ne: userName },
        gender: gender.length === 0 ? { $exists: true } : gender,
        city: city.length === 0 ? { $exists: true } : city,
        age:
          age.length === 0
            ? { $exists: true }
            : { $gt: Number(words[0]), $lt: Number(words[1]) },
      },
      { pass: 0 }
    );

    res.send({
      data: filtered,
      error: false,
      message: "all OK",
    });
  },
};
