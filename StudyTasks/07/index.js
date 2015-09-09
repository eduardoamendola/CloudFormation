console.log('### DEBUG ###\nLoading function');

var AWS = require('aws-sdk');
AWS.config.apiVersions = {
	DynamoDBTable: '2012-08-10'
};
	 
exports.handler = function(event, context) {
	
    var responseData = {};

	// DynamoDB hard-coded table name with same name set in CFN template
	var DynamoDBTable = new AWS.DynamoDB(
		{
			params: {TableName: "ASG_History"}
		}
	);
    
	// Logging event received from SNS (It goes automatically to CloudWatch)
	console.log('### DEBUG ###\nReceived event:', JSON.stringify(event, null, 2));
	
	// Getting SNS message and logging it for debugging purposes
	var SNSmessage = event.Records[0].Sns.Message.toString();
	console.log('### DEBUG ###\nSNSmessage:', SNSmessage);

  // Logging SNS timestamp, as well as the time the lambda function gets triggered
  var SNSPublishTime = event.Records[0].Sns.Timestamp.toString();
  var LambdaReceiveTime = new Date().toString();
  console.log('### DEBUG ###\nSNSPublishTime:', SNSPublishTime);
  console.log('### DEBUG ###\nLambdaReceiveTime:', LambdaReceiveTime);
    
	// Creating items to add to DynamoDB
  var CustomItem = SNSmessage;
  var itemParams = {
  		Item: {
  			status: {
  				S: CustomItem
  		} 
  	}
  };
  
  // Logging itemParams for debugging
  console.log('### DEBUG ###\nitemParams:', itemParams);
	
	// Adding to DynamoDB table
	DynamoDBTable.putItem(
		itemParams, 
  		function(err, data) {
            if (err) {
                responseData = {Error: "### DEBUG ###\nCouldn't add items to DynamoDB"};
                console.log(responseData.Error + ":\n", err);
                context.fail("Failed to process " + event.Records.length + " records.");
		    }
            else {
                responseData = {Success: "### DEBUG ###\nItems added to DynamoDB"};
             	console.log(responseData.Success + ":\n", data);   
             	context.succeed("Successfully processed " + event.Records.length + " records.");
            }
        }
    );
};

