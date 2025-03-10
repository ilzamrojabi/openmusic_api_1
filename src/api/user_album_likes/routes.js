const routes = (handler) => [
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: handler.postUserAlbumLikeHandler,
      options: {
        auth: 'openmusic_jwt',
      },
    },
    {
      method: 'GET',
      path: '/albums/{id}/likes',
      handler: handler.getUserAlbumLikesHandler,
      options: {
        auth: 'openmusic_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/albums/{id}/likes',
      handler: handler.deleteUserAlbumLikeByIdHandler,
      options: {
        auth: 'openmusic_jwt',
      },
    },
  ];

module.exports = routes;