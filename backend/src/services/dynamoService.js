import { 
  ScanCommand, 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb';
import { dynamoDb, BUGS_TABLE } from '../config/aws.js';

export class DynamoBugService {
  /**
   * Fetch all bugs, optionally filtered by stage status (qa, done, approved)
   */
  static async getAllBugs(status = null) {
    if (status) {
      // Query using the Global Secondary Index on status
      const params = {
        TableName: BUGS_TABLE,
        IndexName: 'StatusIndex',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': status
        }
      };

      try {
        const result = await dynamoDb.send(new QueryCommand(params));
        return result.Items || [];
      } catch (err) {
        // Fallback to Scan if GSI is not yet active/configured
        const scanParams = {
          TableName: BUGS_TABLE,
          FilterExpression: '#status = :status',
          ExpressionAttributeNames: { '#status': 'status' },
          ExpressionAttributeValues: { ':status': status }
        };
        const result = await dynamoDb.send(new ScanCommand(scanParams));
        return result.Items || [];
      }
    }

    const params = {
      TableName: BUGS_TABLE
    };
    const result = await dynamoDb.send(new ScanCommand(params));
    return result.Items || [];
  }

  /**
   * Get a single bug by its ID (e.g. BUG-101)
   */
  static async getBugById(id) {
    const params = {
      TableName: BUGS_TABLE,
      Key: { id }
    };
    const result = await dynamoDb.send(new GetCommand(params));
    return result.Item || null;
  }

  /**
   * Create a new bug item in DynamoDB
   */
  static async createBug(bug) {
    const item = {
      ...bug,
      createdAt: bug.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      qaNotes: bug.qaNotes || [],
      attachments: bug.attachments || []
    };

    const params = {
      TableName: BUGS_TABLE,
      Item: item
    };
    await dynamoDb.send(new PutCommand(params));
    return item;
  }

  /**
   * Update bug status (e.g., qa -> done -> approved)
   */
  static async updateBugStatus(id, newStatus) {
    const params = {
      TableName: BUGS_TABLE,
      Key: { id },
      UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':status': newStatus,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };
    const result = await dynamoDb.send(new UpdateCommand(params));
    return result.Attributes;
  }

  /**
   * General bug update (title, description, priority, environment, assignee, etc.)
   */
  static async updateBug(id, fields) {
    const updateExpressions = [];
    const expressionAttributeNames = { '#updatedAt': 'updatedAt' };
    const expressionAttributeValues = { ':updatedAt': new Date().toISOString() };

    for (const [key, value] of Object.entries(fields)) {
      if (key === 'id') continue;
      const attrName = `#attr_${key}`;
      const attrVal = `:val_${key}`;
      updateExpressions.push(`${attrName} = ${attrVal}`);
      expressionAttributeNames[attrName] = key;
      expressionAttributeValues[attrVal] = value;
    }

    if (updateExpressions.length === 0) {
      return await this.getBugById(id);
    }

    const params = {
      TableName: BUGS_TABLE,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}, #updatedAt = :updatedAt`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDb.send(new UpdateCommand(params));
    return result.Attributes;
  }

  /**
   * Append a QA verification note to a bug
   */
  static async addQaNote(id, note) {
    const noteItem = {
      author: note.author || 'QA Tester',
      note: note.note,
      timestamp: note.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString()
    };

    const params = {
      TableName: BUGS_TABLE,
      Key: { id },
      UpdateExpression: 'SET qaNotes = list_append(if_not_exists(qaNotes, :emptyList), :newNote), #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':emptyList': [],
        ':newNote': [noteItem],
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDb.send(new UpdateCommand(params));
    return result.Attributes;
  }

  /**
   * Delete a bug from DynamoDB
   */
  static async deleteBug(id) {
    const params = {
      TableName: BUGS_TABLE,
      Key: { id }
    };
    await dynamoDb.send(new DeleteCommand(params));
    return { id, deleted: true };
  }

  /**
   * Link an S3 attachment metadata record to the bug
   */
  static async addAttachment(id, attachment) {
    const params = {
      TableName: BUGS_TABLE,
      Key: { id },
      UpdateExpression: 'SET attachments = list_append(if_not_exists(attachments, :emptyList), :newAtt), #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':emptyList': [],
        ':newAtt': [attachment],
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDb.send(new UpdateCommand(params));
    return result.Attributes;
  }
}
