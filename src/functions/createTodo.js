const { v4 : uuidv4 } = require('uuid');
const { document } = require('./utils/dynamodbClient');

module.exports.handler = async (event) => {
  const { userid } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body);

  await document.put({
    TableName: 'todosdb',
    Item: {
      id: uuidv4(),
      user_id: userid,
      title,
      done: false,
      deadline
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message:"Todo created!"
    })
  }
}