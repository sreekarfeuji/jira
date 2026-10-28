import { DynamoBugService } from '../services/dynamoService.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Lambda Handler: POST /bugs/{id}/notes
 * Appends a new QA note to the bug item in DynamoDB
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

    if (!body.note || !body.note.trim()) {
      return errorResponse('Note text is required', 400);
    }

    const updatedBug = await DynamoBugService.addQaNote(id, {
      author: body.author || 'QA Tester',
      note: body.note.trim(),
      timestamp: body.timestamp
    });

    return successResponse(updatedBug, 201);
  } catch (err) {
    console.error('Error in addNote handler:', err);
    return errorResponse('Failed to append QA note', 500, err.message);
  }
};
