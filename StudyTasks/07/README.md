## Lambda Function that updates a database whenever a ASG has instances added/removed

1. Create a CFN template that creates a ASG, LaunchConfiguration and Lifecycle hook
2. Create a database with the CFN template, just to store the info
3. Create a custom resource with a lambda function that adds information to the database whenever an instance is launched/terminated from the ASG. (How is it going to be triggered? SNS topic? Lambda directly?)

Reference: http://blogs.aws.amazon.com/application-management/post/Tx2FNAPE4YGYSRV/Customers-CloudFormation-and-Custom-Resources


