const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UserAlbumLikesService {
   constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addUserAlbumLike({albumId, userId}) {
    const id = `user_album_like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);
    await this._cacheService.delete(`album_like:${albumId}`)

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getUserAlbumLikes(userId) {
    const queryUser = {
      text: `SELECT user.id, album.name, users.username
      FROM albums
      JOIN users ON albums.owner = users.id
      WHERE albums.id = $1`,
      values: [albumId],
    };

    const result = await this._pool.query(queryUser);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const queryAlbums = {
      text: `SELECT albums.id, albums.title, albums.performer
            FROM user_albums
            JOIN albums ON user_albums.album_id = albums.id
            WHERE user_albums.user_id= $1`,
      values: [userId],
    };

    const albumResult = await this._pool.query(queryAlbums);

    const albums = albumResult.rows.map((album) => ({
      id: album.id,
      title: album.title,
      performer: album.performer,
    }))

    const user = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        username: result.rows[0].username,
        albums: albums
    }
    return user;
  }


  async deleteUserAlbumLikeById(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    await this._cacheService.delete(`album_like:${albumId}`)

    if (!result.rowCount) {
      throw new InvariantError('Batal menyukai album ');
    }
  }

  async getAlbumLikesByAlbumId(albumId) {
    try {
      const result = await this._cacheService.get(`album_like:${albumId}`)
      return {
        isCache: true,
        like: JSON.parse(result),
      }
    } catch (error) {
      const query = {
        text: `SELECT * FROM user_album_likes WHERE album_id = $1`,
        values: [albumId],
      }
      const result = await this._pool.query(query)

      await this._cacheService.set(
        `album_like:${albumId}`,
        JSON.stringify(result.rowCount),
      )

      return {
        isCache: false,
        like: result.rowCount,
      }
    }
  }

  async verifyUserLikeAlbum(albumId, userId) {
    const query = {
      text: `SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2`,
      values: [albumId, userId],
    }

    const result = await this._pool.query(query)

    if (result.rowCount > 0) {
      throw new InvariantError('Gagal menyukai album yang sama')
    }
  }
}

module.exports = UserAlbumLikesService;