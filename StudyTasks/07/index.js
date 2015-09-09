console.log('### DEBUG ###\nLoading function');

var AWS = require('aws-sdk');
AWS.config.apiVersions = {
	DynamoDBTable: '2012-08-10'
};
	 
exports.handler = function(event, context) {
	
	var responseStatus = "FAILED";
    var responseData = {};

	// DynamoDB hard-coded table name with same name set in CFN template
	var DynamoDBTable = new AWS.DynamoDB(
		{
			params: {TableName: "ASG_History"}
		}
	);
    
	// Logging event received from SNS (It goes automatically to CloudWatch)
	console.log('### DEBUG ###\nReceived event:', JSON.stringify(event, null, 2));
	
	// Getting SNS message
	var SNSmessage = event.Records[0].Sns.Message.toString();
	console.log('### DEBUG ###\nSNSmessage:', SNSmessage);

	// Creating items to add to DynamoDB
	var SNSPublishTime = event.Records[0].Sns.Timestamp.toString();
  	var LambdaReceiveTime = new Date().toString();
  	var CustomItem = SNSPublishTime + "\n" + LambdaReceiveTime + "\n" + SNSmessage
  	var itemParams = {
  		Item: {
  			status: {
  				S: CustomItem
  			} 
  		}
  	};
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
                responseStatus = "SUCCESS";
                responseData = {Success: "### DEBUG ###\nItems added to DynamoDB"};
             	console.log(responseData.Success + ":\n", data);   
             	context.succeed("Successfully processed " + event.Records.length + " records.");
            }
        }
    );

    // Sending responde to Lambda Function
    //sendResponse(event, context, responseStatus, responseData);  
};


// Send response to the pre-signed S3 URL
function sendResponse(event, context, responseStatus, responseData) {

    var responseBody = JSON.stringify({
        Status: responseStatus,
        Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
        PhysicalResourceId: context.logStreamName,
        StackId: event.StackId,
        RequestId: event.RequestId,
        LogicalResourceId: event.LogicalResourceId,
        Data: responseData
    });

    console.log("RESPONSE BODY:\n", responseBody);

    var https = require("https");
    var url = require("url");

    var parsedUrl = url.parse(event.ResponseURL);
    var options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: "PUT",
        headers: {
            "content-type": "",
            "content-length": responseBody.length
        }
    };

    console.log("SENDING RESPONSE...\n");

    var request = https.request(options, function(response) {
        console.log("STATUS: " + response.statusCode);
        console.log("HEADERS: " + JSON.stringify(response.headers));
        // Tell AWS Lambda that the function execution is done
        context.done();
    });

    request.on("error", function(error) {
        console.log("sendResponse Error:" + error);
        // Tell AWS Lambda that the function execution is done
        context.done();
    });

    // write data to request body
    request.write(responseBody);
    request.end();
}