/**
 * Utility functions for API Gateway Lambda Proxy responses
 */

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
};

export const successResponse = (data, statusCode = 200) => {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      success: true,
      data
    })
  };
};

export const errorResponse = (message, statusCode = 500, errorDetails = null) => {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      success: false,
      error: message,
      ...(errorDetails ? { details: errorDetails } : {})
    })
  };
};
