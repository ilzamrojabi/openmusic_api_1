const ClientError = require('../../exceptions/ClientError');

class UserAlbumLikesHandler {
  constructor(UserAlbumLikesService, albumsService, cacheService, validator) {
    this._userAlbumLikesService = UserAlbumLikesService;
    this._albumsService = albumsService;
    this._cacheService = cacheService
    this._validator = validator;


    this.postUserAlbumLikeHandler = this.postUserAlbumLikeHandler.bind(this);
    this.getUserAlbumLikesHandler = this.getUserAlbumLikesHandler.bind(this);
    this.deleteUserAlbumLikeByIdHandler = this.deleteUserAlbumLikeByIdHandler.bind(this);
  }

  async postUserAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._userAlbumLikesService.verifyUserLikeAlbum(albumId, userId)
    await this._albumsService.getAlbumById(albumId)
    await this._userAlbumLikesService.addUser_album_like({albumId, userId})

    const response = h.response({
      status: 'success',
      message: 'Menyukai album',
    });
    response.code(201);
    return response;
  }
  async getUserAlbumLikesHandler(request,h) {
    const { id:albumId } = request.params;

    const {like, isCache} = await this._userAlbumLikesService.getAlbumLikesByAlbumId(albumId)
     const response = h.response({
       status: 'success',
       data: {
         likes: like,
       },
     });
     if (isCache) {
       response.header('X-Data-Source', 'cache');
     } else {
       response.header('X-Data-Source', 'not-cache');
     }
     return response;
   }


async deleteUserAlbumLikeByIdHandler(request, h) {

  // const { id } = request.params;
  // const { id: credentialId } = request.auth.credentials;
  const { id: albumId } = request.params;
  const { id: userId } = request.auth.credentials;
  //await this._userAlbumLikesService.deleteUserAlbumLikeByIdHandler(userId, albumId)

  return {
    status: 'success',
    message: 'Batal menyukai album',
  };
}
}


module.exports = UserAlbumLikesHandler;