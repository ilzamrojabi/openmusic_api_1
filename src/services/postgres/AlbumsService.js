const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapAlbumsToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async addAlbum({ name, year }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
            values: [id, name, year, createdAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbums() {
        const result = await this._pool.query('SELECT * FROM albums');
        return result.rows.map(mapAlbumsToModel);
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        return result.rows.map(mapAlbumsToModel)[0];
    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }
//
    async updateCoverById(id, coverUrl) {
        const query = {
          text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
          values: [coverUrl, id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
          throw new NotFoundError('Gagal memperbarui cover album. Id tidak ditemukan');
        };
      }
    async verifikasiUserAlbumLikes(user_id, album_id) {
        const query = {
          text: 'SELECT user_id, album_id from user_album_likes WHERE user_id = $1 AND album_id = $2',
          values: [user_id, album_id],
        };

        const result = await this._pool.query(query);
        if (result.rows.length > 0) {
          throw new InvariantError('User ini sudah menyukai atau likes dengan album ini!');
        };
    }

    async addLikes(user_id, album_id) {
        await this.verifikasiUserAlbumLikes(user_id, album_id);

        const id = `likes-${nanoid(16)}`;
        const query = {
          text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
          values: [id, user_id, album_id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
          throw new InvariantError('Likes gagal ditambahkan ke dalam database');
        };

        await this._cacheService.delete(`album_likes:${album_id}`);
      }

      async deleteLikes(user_id, album_id) {
        const query = {
          text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
          values: [user_id, album_id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
          throw new NotFoundError('Likes tidak ditemukan untuk dihapus');
        }
        await this._cacheService.delete(`album_likes:${album_id}`);
      }

    async countLikesByAlbumId(album_id) {
        try {
          const result = await this._cacheService.get(`album_likes:${album_id}`);
          const likes = parseInt(result);
          return {
            isCache: true,
            likes,
          };
        } catch (error) {
          const query = {
            text: 'SELECT COUNT(id) FROM user_album_likes WHERE album_id = $1',
            values: [album_id],
          };
          const result = await this._pool.query(query);

          if (!result.rows.length) {
            throw new NotFoundError('Gagal mengambil like!')
          }
          const likes = parseInt(result.rows[0].count)
          await this._cacheService.set(`album_likes:${album_id}`, likes);

          return {
            isCache: false,
            likes
          }
        }
    }
}

module.exports = AlbumsService;