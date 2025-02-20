exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('playlist', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        owner: {
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
        'playlist',
        'fk_playlists.owner',
        'FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE',
    )
};

exports.down = (pgm) => {
    pgm.dropConstraint('playlist', 'fk_playlists.owner')
    pgm.dropTable('playlist');
};