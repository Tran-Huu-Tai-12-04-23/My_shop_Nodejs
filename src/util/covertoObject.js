const covertoObject = {
  singleToObject(user) {
    return user.toObject();
  },

  mutilyToObject(users) {
    const listUsers = users.map((user) => {
      return user.toObject();
    });
    return listUsers;
  },
};

module.exports = covertoObject;
