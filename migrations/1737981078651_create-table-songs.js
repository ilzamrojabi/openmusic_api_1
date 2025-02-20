exports.shorthands = undefined;

exports.up = (pgm) => {

    pgm.createTable('song', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        year: {
            type: 'INTEGER',
            notNull: true,
        },
        genre: {
            type: 'TEXT',
            notNull: true,
        },
        performer: {
            type: 'TEXT',
            notNull: true,
        },
        duration: {
            type: 'INTEGER',
            notNull: true,
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: false,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    });

    pgm.addConstraint(
        'song',
        'fk_song.albumId',
        'FOREIGN KEY ("albumId") REFERENCES albums(id) ON DELETE CASCADE',
    )
};

exports.down = (pgm) => {
    pgm.dropConstraint('song', 'fk_song.albumId')
    pgm.dropTable('song');
};
