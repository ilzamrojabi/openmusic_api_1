const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistsPayloadSchema, PlaylistSongsPayloadSchema, } = require('./schema');

const PlaylistValidator = {
    validatePlaylistPayload: payload => {
        const validationResult = PlaylistsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validatePlaylistSongPayload: payload => {
        const validationResult = PlaylistSongsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistValidator;