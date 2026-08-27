// Standardized API response formatter

class ResponseFormatter {
  // Success response
  static success(res, data = null, message = 'Success', statusCode = 200) {
    const response = {
      status: 'success',
      message
    };

    if (data !== null) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  // Error response
  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    const response = {
      status: 'error',
      message
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  // Created response (201)
  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  // No content response (204)
  static noContent(res) {
    return res.status(204).send();
  }

  // Bad request (400)
  static badRequest(res, message = 'Bad request', errors = null) {
    return this.error(res, message, 400, errors);
  }

  // Unauthorized (401)
  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, message, 401);
  }

  // Forbidden (403)
  static forbidden(res, message = 'Access forbidden') {
    return this.error(res, message, 403);
  }

  // Not found (404)
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  // Conflict (409)
  static conflict(res, message = 'Resource conflict') {
    return this.error(res, message, 409);
  }

  // Validation error (422)
  static validationError(res, errors, message = 'Validation failed') {
    return this.error(res, message, 422, errors);
  }

  // Internal server error (500)
  static serverError(res, message = 'Internal server error') {
    return this.error(res, message, 500);
  }

  // Paginated response
  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      status: 'success',
      message,
      results: data.length,
      pagination,
      data
    });
  }
}

module.exports = ResponseFormatter;
