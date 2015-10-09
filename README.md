#AWS CloudFormation

Collection of templates and docs related to Cloud Formation during my studies

## Notes 

### Goals

* Be comfortable reading JSON templates
* Be able to easily search for AWS resources of any type
* Understand the various CFN-related tools (cloud-init vs. cfn-init, cfn-hup and cfn-signal)
* Hold a wide breadth of understanding of various AWS Services, and how they would be built on CFN
* Be able to explain the following: WaitConditions, Ref calls, Parameters, Mappings 
* Understand the relationship between CFN calls and the HTTPS APIs for the various services. 
* Understand how to use custom resources (Lambda functions, SNS topics, etc)

### Features

* Template-based
* Only "Resources" is mandatory in template
* A few resourcers can't be created through CFN, such as KeyPairs, R53 HostedZones, etc

### Limitations

* It's not possible to migrate resources into CFN that were already manually created outside of CFN without tearing it all down and rebuilding it from CFN. One option would be to use CloudFormer to create a template, and then edit it and schedulle a maintenance window to migrate them little by little, preferably by truncating the template into several nested ones as well.
* There is currently no official way in CFN to specify the permissions needed for an SNS topic to trigger the Lambda function. It has to be done through a Custom Resource (Example can be found on StudyTask 08). Note: A new resource type AWS::Lambda::Permission was announced in October that's supposed to fix this. I haven't tested it yet though.

### Tips and A-HA moments

* Always use tags where possible, so you won't have issues with resources changing ids due updates
* Create security groups with nothing, and then add the rules after (to avoid circular dependency issues)

## Tools

### JSON Tools 

#### Validators
* JSONLint - The JSON Validator: http://jsonlint.com/
* JSON Validator: http://www.freeformatter.com/json-validator.html
* JSON formater and validator: http://jsonformatter.curiousconcept.com/

#### Viewers
* JQ - Lightweight and flexible command-line JSON processor: http://stedolan.github.io/jq/

## Documentation
* CloudFormation User-guide: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html
* Developer Tools: http://aws.amazon.com/developertools/AWS-CloudFormation?browse=1
* Official public articles and tutorials: http://aws.amazon.com/cloudformation/aws-cloudformation-articles-and-tutorials/

### CFN-Init

* It runs as root and it uses sh shell
