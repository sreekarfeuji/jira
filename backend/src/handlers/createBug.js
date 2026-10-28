import { DynamoBugService } from '../services/dynamoService.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Lambda Handler: POST /bugs
 */
export const handler = async (event) => {
  try {
    if (!event.body) {
      return errorResponse('Request body is missing', 400);
    }

    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    if (!body.title || !body.title.trim()) {
      return errorResponse('Bug title is required', 400);
    }

    // Auto-generate ID if not provided: BUG-XXX
    const bugId = body.id || `BUG-${Math.floor(100 + Math.random() * 900)}`;

    const bugItem = {
      id: bugId,
      title: body.title.trim(),
      description: body.description || '',
      status: body.status || 'qa', // default to 'qa'
      priority: body.priority || 'Medium',
      environment: body.environment || 'Staging',
      assignee: body.assignee || {
        name: 'Unassigned',
        role: 'Team Member',
        avatarBg: '#6B778C',
        initials: 'UA'
      },
      reporter: body.reporter || {
        name: 'Sarah Jenkins',
        avatarBg: '#FF5630',
        initials: 'SJ'
      },
      createdDate: body.createdDate || 'Just now',
      qaNotes: body.qaNotes || [],
      attachments: body.attachments || []
    };

    const createdBug = await DynamoBugService.createBug(bugItem);
    return successResponse(createdBug, 201);
  } catch (err) {
    console.error('Error in createBug handler:', err);
    return errorResponse('Failed to create bug in DynamoDB', 500, err.message);
  }
};
