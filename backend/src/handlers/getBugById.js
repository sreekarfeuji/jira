import { DynamoBugService } from '../services/dynamoService.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Lambda Handler: GET /bugs/{id}
 */
export const handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return errorResponse('Bug ID is required in path parameters', 400);
    }

    const bug = await DynamoBugService.getBugById(id);
    if (!bug) {
      return errorResponse(`Bug with ID '${id}' not found`, 404);
    }

    return successResponse(bug);
  } catch (err) {
    console.error('Error in getBugById handler:', err);
    return errorResponse('Failed to retrieve bug', 500, err.message);
  }
};
