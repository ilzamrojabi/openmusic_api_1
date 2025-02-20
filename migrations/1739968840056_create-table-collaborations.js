exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('collaborations', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
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
        'collaborations',
        'fk_collaborations.playlist_id',
        'FOREIGN KEY (playlist_id) REFERENCES playlist(id) ON DELETE CASCADE',
    );

    pgm.addConstraint(
        'collaborations',
        'fk_collaborations.user_id',
        'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE',
    );
};

exports.down = (pgm) => {
    pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id');
    pgm.dropConstraint('collaborations', 'fk_collaborations.user_id');
    pgm.dropTable('collaborations');
};