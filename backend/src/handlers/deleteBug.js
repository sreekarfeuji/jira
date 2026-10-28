import { DynamoBugService } from '../services/dynamoService.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Lambda Handler: DELETE /bugs/{id}
 */
export const handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return errorResponse('Bug ID is required in path parameters', 400);
    }

    const existingBug = await DynamoBugService.getBugById(id);
    if (!existingBug) {
      return errorResponse(`Bug with ID '${id}' not found`, 404);
    }

    const result = await DynamoBugService.deleteBug(id);
    return successResponse({ message: `Bug '${id}' successfully deleted`, ...result });
  } catch (err) {
    console.error('Error in deleteBug handler:', err);
    return errorResponse('Failed to delete bug', 500, err.message);
  }
};
