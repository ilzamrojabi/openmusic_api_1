const mapAlbumsToModel = ({
    id,
    name,
    year,
    cover,
    created_at,
    updated_at
}) => ({
    id,
    name,
    year,
    coverUrl: cover,
    createdAt: created_at,
    updatedAt: updated_at,
});

const mapSongsToModel = ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    album_id,
    created_at,
    updated_at
}) => ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    album_id,
    createdAt: created_at,
    updatedAt: updated_at,
})

module.exports = { mapAlbumsToModel, mapSongsToModel };