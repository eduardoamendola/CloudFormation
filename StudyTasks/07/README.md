## Lambda Function that updates a database whenever a ASG has instances added/removed

1. Create a CFN template that creates a ASG, a LaunchConfiguration and a SNS Topic
2. Change the template in order to make the ASG to subscribe to the SNS topic and send notifications in case any of the instances get added/removed from the ASG for any reason (either failure or termination).
3. Outside of CFN, create a Lambda function that handles the messages sent to the topic regarding the eventual failures on instances and updates a DynamoDB database with a history of such information.

Reference: https://mobile.awsblog.com/post/Tx1VE917Z8J4UDY/Invoking-AWS-Lambda-functions-via-Amazon-SNS


