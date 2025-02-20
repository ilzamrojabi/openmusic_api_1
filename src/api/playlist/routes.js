const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistsHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistByIdHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
    // Playlist Songs
    {
        method: 'POST',
        path: '/playlists/{playlistIdJohn}/songs',
        handler: handler.postSongToPlaylistHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlistIdJohn}/songs',
        handler: handler.getSongsFromPlaylistByIdHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistIdJohn}/songs',
        handler: handler.deleteSongFromPlaylistByIdHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
];

module.exports = routes;