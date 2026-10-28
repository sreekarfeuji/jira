import { DynamoBugService } from '../services/dynamoService.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Lambda Handler: PUT /bugs/{id} or PATCH /bugs/{id}
 * Handles stage movements (qa -> done -> approved) and field edits
 */
export const handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return errorResponse('Bug ID is required in path parameters', 400);
    }

    if (!event.body) {
      return errorResponse('Request body is missing', 400);
    }

    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    // Check if bug exists first
    const existingBug = await DynamoBugService.getBugById(id);
    if (!existingBug) {
      return errorResponse(`Bug with ID '${id}' not found`, 404);
    }

    // Validate status if updating status
    if (body.status && !['qa', 'done', 'approved'].includes(body.status)) {
      return errorResponse(`Invalid status '${body.status}'. Must be one of: 'qa', 'done', 'approved'`, 400);
    }

    const updatedBug = await DynamoBugService.updateBug(id, body);
    return successResponse(updatedBug);
  } catch (err) {
    console.error('Error in updateBug handler:', err);
    return errorResponse('Failed to update bug', 500, err.message);
  }
};
