const { document } = require('./utils/dynamodbClient');

module.exports.handler = async (event) => {
  const { userid } = event.pathParameters;

  const response = await document.query({
    TableName: 'todosdb',
    IndexName: 'usersIdIndex',
    KeyConditionExpression: 'user_id = :userid',
    ExpressionAttributeValues: {
      ":userid": userid
    }
  }).promise();
console.log(response)
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
} 