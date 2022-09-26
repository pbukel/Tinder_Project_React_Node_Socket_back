const regSchema = require("../schemas/regSchema");

module.exports = {
  getUsernames: async (username) => {
    console.log(username);
    const sameUserName = await regSchema.findOne({ userName: username });

    return sameUserName ? true : false;
  },

  addRemoveLikes: async (userName, LikedUsernameName) => {
    console.log(userName, LikedUsernameName);
    const myUser = await regSchema.findOne({ userName });

    if (!myUser.myLikes.includes(LikedUsernameName)) {
      await regSchema.findOneAndUpdate(
        { userName },
        { $addToSet: { myLikes: LikedUsernameName } }
      );
      await regSchema.findOneAndUpdate(
        { userName: LikedUsernameName },
        { $addToSet: { whoLikesme: userName } }
      );
    } else {
      await regSchema.findOneAndUpdate(
        { userName },
        { $pull: { myLikes: LikedUsernameName } }
      );
      await regSchema.findOneAndUpdate(
        { userName: LikedUsernameName },
        { $pull: { whoLikesme: userName } }
      );
    }

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
    const user2 = await regSchema.findOne({ userName: LikedUsernameName });

    // console.log(newUser);
    return [newUser, user2];
  },
  updateAllUsers: async (userName) => {
    let allUser = await regSchema.find(
      { userName: { $ne: userName } },
      { pass: 0 }
    );
    return allUser;
  },
  sendFavorites: async (userName) => {
    const myUser = await regSchema.findOne({ userName });
    const favoritesUsers = myUser.myLikes;
    const favoritUserArray = await regSchema.find({
      userName: { $in: favoritesUsers },
    });

    return favoritUserArray;
  },
  sendWhoLikeMe: async (userName) => {
    const myUser = await regSchema.findOne({ userName });
    const likeUsers = myUser.whoLikesme;
    const likeUserArray = await regSchema.find({
      userName: { $in: likeUsers },
    });

    return likeUserArray;
  },
};
