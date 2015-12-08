## S3 Authentication

1. Create a template that contains an Not-Public S3 bucket and an ec2 instance
2. On the userdata/metadata, configure the instance to download a file from an image from the s3 bucket and include in the instance's httpd index 

* It must use the http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-authentication.html
