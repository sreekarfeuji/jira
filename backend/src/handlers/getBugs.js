import { DynamoBugService } from '../services/dynamoService.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Lambda Handler: GET /bugs
 * Supports query parameters: ?status=qa|done|approved
 */
export const handler = async (event) => {
  try {
    const status = event.queryStringParameters?.status || null;
    const bugs = await DynamoBugService.getAllBugs(status);

    // Grouping summary by stage for rapid UI consumption
    const summary = {
      total: bugs.length,
      qa: bugs.filter(b => b.status === 'qa').length,
      done: bugs.filter(b => b.status === 'done').length,
      approved: bugs.filter(b => b.status === 'approved').length
    };

    return successResponse({
      bugs,
      summary
    });
  } catch (err) {
    console.error('Error in getBugs handler:', err);
    return errorResponse('Failed to retrieve bugs from DynamoDB', 500, err.message);
  }
};
