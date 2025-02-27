const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request, h){
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
      return {
        status: 'success',
        data: {
          album,
        },
      };
    }

  async putAlbumByIdHandler(request){
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request){
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async uploadAlbumCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    this._validator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    await this._service.updateCoverById(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postAlbumByIdLikesHandler(request, h) {
    const { id: album_id } = request.params;
    await this._service.getAlbumById(album_id);

    const user_id = request.auth.credentials.id;

    await this._service.addLikes(user_id, album_id);

    const response = h.response({
      status: 'success',
      message: 'Likes berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumByIdLikesHandler(request, h) {
    const { id: album_id } = request.params;
    await this._service.getAlbumById(album_id);

    const user_id = request.auth.credentials.id;
    await this._service.deleteLikes(user_id, album_id);

    const response = h.response({
      status: 'success',
      message: 'Likes berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async getAlbumByIdLikesHandler(request, h) {
    const { id: album_id } = request.params;

    const { likes, isCache } = await this._service.countLikesByAlbumId(album_id);

    const response = h.response({
      status: 'success',
      data: {
        likes: likes,
      },
    });

    if (isCache) {
      response.header('X-Data-Source', 'cache');
    } else {
      response.header('X-Data-Source', 'no-cache');
    }

    return response;
  }
}

module.exports = AlbumsHandler;