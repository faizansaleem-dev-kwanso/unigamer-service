'use strict';
import AWS from 'aws-sdk';
import { ScanInput } from 'aws-sdk/clients/dynamodb';
import { btoa } from '../../src/utils/helper';
const dynamo = new AWS.DynamoDB.DocumentClient();

const CONNECTION_DB_TABLE = process.env.CONNECTION_DB_TABLE;

const successfullResponse = {
  statusCode: 200,
  body: 'Success',
};

const failedResponse = (statusCode, error) => ({
  statusCode,
  body: error,
});

module.exports.connectHandler = (event, context, callback) => {
  const { userId } = event.queryStringParameters;
  addConnection(event.requestContext.connectionId, userId)
    .then(() => {
      callback(null, successfullResponse);
    })
    .catch((err) => {
      callback(failedResponse(500, JSON.stringify(err)));
    });
};

module.exports.disconnectHandler = (event, context, callback) => {
  console.log(event);
  deleteConnection(event.requestContext.connectionId)
    .then(() => {
      callback(null, successfullResponse);
    })
    .catch((err) => {
      console.log(err);
      callback(failedResponse(500, JSON.stringify(err)));
    });
};

module.exports.defaultHandler = (event, context, callback) => {
  callback(null, failedResponse(404, 'No event found'));
};

module.exports.broadcastHandler = (event, context, callback) => {
  sendMessageToAllConnected(event)
    .then(() => {
      callback(null, successfullResponse);
    })
    .catch((err) => {
      callback(failedResponse(500, JSON.stringify(err)));
    });
};

module.exports.notificationHandler = (event, context, callback) => {
  sendMessageToRecipient(event)
    .then(() => {
      callback(null, successfullResponse);
    })
    .catch((err) => {
      callback(failedResponse(500, JSON.stringify(err)));
    });
};

const sendMessageToRecipient = (event) => {
  const body = JSON.parse(event.body);
  const payload = JSON.parse(`${btoa(body.data)}`);
  return getConnectionsByUserId(payload.recipient).then((connectionsData) => {
    console.log(connectionsData);
    return connectionsData.Items.map((connection) => {
      if (event.requestContext.connectionId === connection.connectionId)
        return false;
      return send(event, connection.connectionId);
    });
  });
};

const sendMessageToAllConnected = (event) => {
  return getAllConnections().then((connectionsData) => {
    return connectionsData.Items.map((connection) => {
      if (event.requestContext.connectionId === connection.connectionId)
        return false;
      return send(event, connection.connectionId);
    });
  });
};

const getAllConnections = () => {
  const params = {
    TableName: CONNECTION_DB_TABLE,
    ProjectionExpression: 'connectionId',
  };

  return dynamo.scan(params).promise();
};

const getConnectionsByUserId = (userId: string) => {
  const params = {
    TableName: CONNECTION_DB_TABLE,
    ExpressionAttributeNames: {
      '#UG_userId': 'userId',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    FilterExpression: '#UG_userId = :userId',
    ProjectionExpression: 'connectionId',
  };
  console.log(params);
  return dynamo.scan(params).promise();
};

const send = async (event, connectionId) => {
  const body = JSON.parse(event.body);
  let postData = body.data;
  console.log('Sending.....');

  if (typeof postData === 'object') {
    console.log('It was an object');
    postData = JSON.stringify(postData);
  } else if (typeof postData === 'string') {
    console.log('It was a string');
  }

  const endpoint = event.requestContext.domainName;
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: endpoint,
  });

  const params = {
    ConnectionId: connectionId,
    Data: postData,
  };
  apigwManagementApi.postToConnection(params, async (err, success) => {
    console.log(err);
    console.log(success);
    if (err) {
      if (!err.retryable) {
        // Socket id is disabled
        deleteConnection(connectionId);
      }
    }
  });
  return true;
};

const addConnection = (connectionId, userId) => {
  console.log(connectionId, userId);
  const params = {
    TableName: CONNECTION_DB_TABLE,
    Item: {
      connectionId: connectionId,
      userId: userId,
    },
  };

  return dynamo.put(params).promise();
};

const deleteConnection = (connectionId) => {
  const params = {
    TableName: CONNECTION_DB_TABLE,
    Key: {
      connectionId: connectionId,
    },
  };

  return dynamo.delete(params).promise();
};
