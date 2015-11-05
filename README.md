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
* Every resource can contain a Metadata, which basically appends a JSON-structured value to such resource. You can retrieve resource metadata from the CFN stacks in two ways:

- AWS CLI. Example: 

$ aws cloudformation describe-stack-resource --stack-name ec2-bootstrapped-webserver --logical-resource-id WebServerSecurityGroup

STACKRESOURCEDETAIL	2015-11-05T18:02:20.381Z	WebServerSecurityGroup	{"Object1":"whatever1","Object2":"whatever2"}	ec2-bootstrapped-webserver-WebServerSecurityGroup-1L8GBCZDGRR7G	UPDATE_COMPLETE	AWS::EC2::SecurityGroup	arn:aws:cloudformation:eu-west-1:429230952994:stack/ec2-bootstrapped-webserver/0a3ff450-83de-11e5-8605-50a68645b2d2	ec2-bootstrapped-webserver

- cfn-get-metadata helper script (it must be installed via aws-cfn-bootstrap package for linux/windows. Although it's installed by defaul in Amazon Linux). Example:

$ cfn-get-metadata --access-key XXXX --secret-key XXXX --stack ec2-bootstrapped-webserver --resource WebServerSecurityGroup --region eu-west-1
{
    "Object1": "whatever1",
    "Object2": "whatever2"
}

### Limitations

* It's not possible to migrate resources into CFN that were already manually created outside of CFN without tearing it all down and rebuilding it from CFN. One option would be to use CloudFormer to create a template, and then edit it and schedulle a maintenance window to migrate them little by little, preferably by truncating the template into several nested ones as well.

* [FIXED ALREADY] There is currently no official way in CFN to specify the permissions needed for an SNS topic to trigger the Lambda function. It has to be done through a Custom Resource (Example can be found on StudyTask 08). Note: A new resource type AWS::Lambda::Permission was announced in October to fix this. I tested and added an example of its use in Study task 08.

### Tips and A-HA moments

* Always use tags where possible, so you won't have issues with resources changing ids due updates

* Create security groups with nothing, and then add the rules after (to avoid circular dependency issues)

* Whenever you create a stack through the AWS CLI, it uses Python 2.7 running Boto libs to connect to AWS via HTTP, through a regional endpoint of the service (i.e: https://cloudformation.eu-west-1.amazonaws.com/), via HTTPS, to make an HTTP POST to a rest API service, and then such api call that creates the stack. After that, it can return the following response codes:

-=- create-stack or update-stack -=-

Returns a 200 response code (HTTP OK), which will also contain some data, such as the RequestID of the stack creation, as well as the ARN of the new stack that's being created. Example captured with --debug argument of the aws CLI command:

<bash>

$ aws cloudformation create-stack --stack-name ec2-bootstrapped-webserver --template-body file://~/Git/CloudFormation/StudyTasks/cfn-init/ec2-amazon-linux-apache-php.cform --parameters ParameterKey=KeyName,ParameterValue=AmazonLinuxIreland ParameterKey=InstanceType,ParameterValue=t1.micro --debug

...

2015-11-05 16:55:38,724 - MainThread - awscli.formatter - DEBUG - RequestId: 0a31c388-83de-11e5-b082-33dd0ab48d35
arn:aws:cloudformation:eu-west-1:429230952994:stack/ec2-bootstrapped-webserver/0a3ff450-83de-11e5-8605-50a68645b2d2
$

</bash>

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

## Helper Scripts

AWS CloudFormation includes a set of helper scripts (cfn-init, cfn-signal, cfn-get-metadata, and cfn-hup) that are based on cloud-init. You call these helper scripts from your AWS CloudFormation templates to install, configure, and update applications on Amazon EC2 instances that are in the same template.

### CFN-Init

* The cfn-init helper script reads template metadata from the AWS::CloudFormation::Init key and acts accordingly to:

- Fetch and parse metadata from CloudFormation
- Install packages
- Write files to disk
- Enable/disable and start/stop services

* It runs as root and it uses sh shell

### CFN-Hup

The cfn-hup helper is a daemon that detects changes in resource metadata and runs user-specified actions when a change is detected. This allows you to make configuration updates on your running Amazon EC2 instances through the UpdateStack API action.

It has 2 configuration files (stored in /etc/cfn/ when installed through aws-cfn-bootstrap package for linux. Although it's installed by default in Amazon Linux):

* cfn-hup.conf: Contains Stack name and AWS credentials that the cfn-hup daemon targets
* hooks.conf: Contains the user actions that the cfn-hup daemon calls periodically. The hooks configuration file is loaded at cfn-hup daemon startup only, so new hooks will require the daemon to be restarted. A cache of previous metadata values is stored at /var/lib/cfn-hup/data/metadata_db (not human readable)—you can delete this cache to force cfn-hup to run all post.add actions again.






