const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
    constructor(collaborationsService, cacheService) {
        this._pool = new Pool();
        this._collaborationsService = collaborationsService;
        this._cacheService = cacheService;
    }

    async addPlaylist({ name, owner }) {
        const id = nanoid(16);

        const query = {
            text: `INSERT INTO playlist VALUES ($1, $2, $3) RETURNING id`,
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');

        }
        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `
                SELECT playlist.id, playlist.name, users.username FROM playlist LEFT JOIN users ON users.id = playlist.owner LEFT JOIN collaborations ON collaborations.playlist_id = playlist.id WHERE playlist.owner = $1 OR collaborations.user_id = $1`,
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async getPlaylistById(playlistId) {
        const query = {
            text: `
                SELECT playlist.id, playlist.name, users.username FROM playlist
                JOIN users ON users.id = playlist.owner
                WHERE playlist.id = $1`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows[0];
    }

    async deletePlaylistById(id) {
        const query = {
            text: `DELETE FROM playlist WHERE id = $1 RETURNING id`,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Gagal menghapus playlist karena ID tidak ditemukan');

        }
        await this._cacheService.delete(`playlist:${owner}`);
        return result.rows[0].id;
    }

    async addSongPlaylist({ playlistId, songId }) {
        const checkSongQuery = {
            text: 'SELECT id FROM song WHERE id = $1',
            values: [songId],
        };

        const songResult = await this._pool.query(checkSongQuery);

        if (songResult.rowCount === 0) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        const id = nanoid(16);

        const query = {
            text: `
                INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id`,
            values: [id, playlistId, songId],
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Gagal menambahkan data lagu di playlist');
        }

        return result.rows[0].id;
    }

    async getSongsFromPlaylistById(playlistId) {
        const query = {
            text: `SELECT song.id, song.title, song.performer FROM song
            LEFT JOIN playlist_songs ON song.id = playlist_songs.song_id
            WHERE playlist_songs.playlist_id = $1`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async deleteSongFromPlaylistById(playlistId, songId) {
        const query = {
            text: `DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id`,
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Playlist song gagal dihapus, playlist id dan song id tidak ditemukan');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyCollaborator(playlistId, userId);
            } catch {
                throw new AuthorizationError('Anda tidak memiliki akses ke playlist ini');
            }
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlist WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
        throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
}

module.exports = PlaylistService;