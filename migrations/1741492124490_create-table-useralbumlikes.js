exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('user_album_likes', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        album_id: {
          type: 'VARCHAR(50)',
          notNull: true,
          references: '"albums"',
          onDelete: 'CASCADE'
        },
        user_id: {
          type: 'VARCHAR(50)',
          notNull: true,
          references: '"users"',
          onDelete: 'CASCADE'
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('user_album_likes');
};
