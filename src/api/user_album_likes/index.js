const UserAlbumLikesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "user_album_likes",
  version: "1.0.0",
  register: async (server, { userAlbumLikesService, albumsService, cacheService, validator }) => {
    const useralbumlikesHandler = new UserAlbumLikesHandler(userAlbumLikesService, albumsService, cacheService, validator);
    server.route(routes(useralbumlikesHandler));
  },
};