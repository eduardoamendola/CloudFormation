## ECS integration with CFN

1. Create an ECS with AWS CLI manually: http://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_AWSCLI.html
2. Create a CFN template to do the same as step 1
3. Convert your single stack to a parent stack with 2 netsted stacks (one for the ECS, one for the VPC)
