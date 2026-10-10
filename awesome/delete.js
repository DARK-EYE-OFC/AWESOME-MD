const del = require('./del');
module.exports = {
  name: "delete",
  category: "Group",
  async execute(sock, msg, args, extra) {
    return del.execute(sock, msg, args, extra);
  }
};
