## Lambda Function that updates a database whenever a ASG has instances added/removed

1. Create a CFN template that creates a ASG, a LaunchConfiguration and a SNS Topic
2. Change the template in order to make the ASG to subscribe to the SNS topic and send notifications in case any of the instances get added/removed from the ASG for any reason (either failure or termination).
3. Add DynamoDB resource, exporting credentials to outputs
4. Outside of CFN, create a Lambda function that handles the messages sent to the topic regarding the eventual failures on instances and updates a DynamoDB database with a history of such information.
5. Create a Custom Resource that associates the lambda function to the SNS topic and triggers it to update the DynamoDB table, to log whenever an instance goes down/up 

The main purpose of this exercise is to show how a custom resource can possibly take any other actions when one instance from your ASG gets corrupt, such as modifying R53 RecordSets by adding/removing the A records with the new instances from the ASG, for example. 

Reference: https://mobile.awsblog.com/post/Tx1VE917Z8J4UDY/Invoking-AWS-Lambda-functions-via-Amazon-SNS


