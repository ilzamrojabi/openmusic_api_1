const InvariantError = require('../../exceptions/InvariantError');

const CollaborationsValidator = {
    validateCollaborationsPayload: payload => {
        const validationResult = CollaborationsValidator.validateCollaborationPayload(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
}

module.exports = CollaborationsValidator;