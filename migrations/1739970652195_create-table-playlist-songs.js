exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('playlist_songs', {
        id: {
            type: 'TEXT',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });

    pgm.addConstraint(
        'playlist_songs',
        'fk_playlist_songs.playlist_id',
        'FOREIGN KEY (playlist_id) REFERENCES playlist (id) ON DELETE CASCADE',
    );

    pgm.addConstraint(
        'playlist_songs',
        'fk_playlist_songs.song_id',
        'FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE',
    );
};

exports.down = (pgm) => {
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id');
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song_id');
    pgm.dropTable('playlist_songs');
};