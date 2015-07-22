
# Notes 

* RandomString.zip: It contains a simple Lambda Function written in NodeJS that generates random strings and returns them through the handler. 
* CFNCustomResource-LambdaFunction.cform: Simple Cloudformation template that creates the custom resource that returns a random string retrieved from a Lambda Function

Once you download the files, you can go through the following procedures to get it running:

1. Upload "RandomString.zip" file to a S3 bucket of your choice and make sure you give the right access permissions for it.
2. Create the Cloudformation stack with the template "CFNCustomResource-LambdaFunction.cform", and type in the "s3Bucket" and the "LambdaFunctionPackage" as Parameters to point to the S3 bucket where you stored the "RandomString.zip" file (Lambda function)
