const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportMusicHandler = this.postExportMusicHandler.bind(this);
  }

  async postExportMusicHandler(request, h) {
    this._validator.validateExportMusicPayload(request.payload);

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:notes', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;