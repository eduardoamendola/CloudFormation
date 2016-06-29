#AWS CloudFormation

Collection of templates and docs related to Cloud Formation during my studies

## Notes 

## To-Do

* Review the latest release notes
* Read the latest blog articles

### Goals

* Understand how the AWS::CloudFormation::Authentication works
* Be comfortable reading JSON templates
* Be able to easily search for AWS resources of any type
* Understand how a custom resouce works if you don't use lambda
* Understand WaitConditions
* Understand the various CFN-related tools (cloud-init vs. cfn-init, cfn-hup and cfn-signal)
* Hold a wide breadth of understanding of various AWS Services, and how they would be built on CFN
* Be able to explain the following: WaitConditions, Ref calls, Parameters, Mappings 
* Understand the relationship between CFN calls and the HTTPS APIs for the various services. 
* Understand how to use custom resources (Lambda functions, SNS topics, etc)
* Learn how cloudformation sets up AutoScaling/LaunchConfiguration to perform migrations with zero downtime
* Understand CFN tags on resources

### Features

* Template-based
* Only "Resources" is mandatory in template
* A few resourcers can't be created through CFN, such as KeyPairs, R53 HostedZones, etc
* Every resource can contain a Metadata, which basically appends a JSON-structured value to such resource. You can retrieve resource metadata from the CFN stacks in 2 ways:

1. AWS CLI. Example: 

```bash
$ aws cloudformation describe-stack-resource --stack-name ec2-bootstrapped-webserver 
                                             --logical-resource-id WebServerSecurityGroup

STACKRESOURCEDETAIL	2015-11-05T18:02:20.381Z	WebServerSecurityGroup	
{"Object1":"whatever1","Object2":"whatever2"}	
ec2-bootstrapped-webserver-WebServerSecurityGroup-1L8GBCZDGRR7G	
UPDATE_COMPLETE	AWS::EC2::SecurityGroup	
arn:aws:cloudformation:eu-west-1:429230952994:stack/ec2-bootstrapped-webserver/0a3ff450-83de-11e5-8605-50a68645b2d2	
ec2-bootstrapped-webserver
```

2. cfn-get-metadata helper script (it must be installed via aws-cfn-bootstrap package for linux/windows. Although it's installed by defaul in Amazon Linux). Example:

```bash
$ cfn-get-metadata --access-key XXXX --secret-key XXXX 
                   --stack ec2-bootstrapped-webserver 
                   --resource WebServerSecurityGroup 
                   --region eu-west-1
{
    "Object1": "whatever1",
    "Object2": "whatever2"
}
```

### Limitations

* It's not possible to migrate resources into CFN that were already manually created outside of CFN without tearing it all down and rebuilding it from CFN. So if a customer wants to migrate his current infrastructure into CFN, one option would be to use CloudFormer to create a template, and then edit it and schedulle a maintenance window to migrate them little by little, preferably by truncating the template into several nested ones as well.

* [FIXED ALREADY] There is currently no official way in CFN to specify the permissions needed for an SNS topic to trigger the Lambda function. It has to be done through a Custom Resource (Example can be found on StudyTask 08). Note: A new resource type AWS::Lambda::Permission was announced in October/2015 to fix this. I tested and added an example of its use in Study task 08.

### Tips and A-HA moments

* Always use tags where possible, so you won't have issues with resources changing ids due updates

* Create security groups with nothing, and then add the rules after (to avoid circular dependency issues)

* Whenever you create a stack through the AWS CLI, it uses Python 2.7 running Boto libs to connect to AWS via HTTP, through a regional endpoint of the service (i.e: https://cloudformation.eu-west-1.amazonaws.com/), via HTTPS, to make an HTTP POST to a rest API service, and then such api call that creates the stack. After that, it can return the following response codes:

* CFN tags every resource it can, so given an instance you should be able to lookup the tags and get me the stack ARN.

* CloudFormation guarantees that the stack matches the physical resources, based on the current template. Basically, CloudFormation guarantees that every creation/update will be either 100% successful, or 100% rolled back. For example, if you are creating/updating 5 resources but only one fails, CloudFormation is going rollback everything, including the other 4 ones that completed successfully. 

* CloudFormation always wants to be able to roll back, so it'll create new resources to replace the old ones. If the update works, the old
resources are deleted in the CLEANUP process. If the update fails, the old resources are still around. This applies for resources that require replacement.

* CloudFormation released a new feature on the 26th of February of 2016 that solved the problems with stacks stuck in DELETE_FAILED: the "RetainResources" parameter. You can retain the problematic resources and delete the rest of the stack, and then you can manually delete them after. That's available via CLI/API, and also via Console when "Delete" action is initiated (a new window pops up asking for what to do with the resources that failed to delete). If used, CFN events are going to show the retained resources as "DELETE_SKIPPED" and deletion should complete just fine.

Example with CLI:

```bash
$ aws cloudformation delete-stack --stack-name my-problematic-stack --retain-resources "AWSEBSecurityGroup" "AWSEBLoadBalancerSecurityGroup"
```

### Tags 

CFN tags every resource it can, so given an instance you should be able to lookup the tags and get me the stack ARN.

There are 3 tags that are added by cfn by default:

* aws:cloudformation:logical-id
* aws:cloudformation:stack-id
* aws:cloudformation:stack-name

Note: They can't be removed. Even if you retain the resource and delete the stack, it's still not possible to delete them.

However, some resources do not support tags, such as EBS volumes that are created from block device mappings. In that case, the way would be to check the physical resource ID and check if it's the same one on your stacks. 

Additionally, if CloudTrail is enabled, you can check for the api calls that initiated the resource creation. So you can check if "invokedBy", "sourceIPAddress" and "userAgent" properties are set as "cloudformation.amazonaws.com".

### CLI Specifics

#### create-stack / update-stack

Returns a 200 response code (HTTP OK), which will also contain some data, such as the RequestID of the stack creation, as well as the ARN of the new stack that's being created. Example captured with --debug argument of the aws CLI command:

```bash
$ aws cloudformation create-stack 
      --stack-name ec2-bootstrapped-webserver 
      --template-body file://~/Git/CloudFormation/StudyTasks/cfn-init/ec2-amazon-linux-apache-php.cform 
      --parameters ParameterKey=KeyName,ParameterValue=AmazonLinuxIreland ParameterKey=InstanceType,ParameterValue=t1.micro 
      --debug

...

2015-11-05 16:55:38,724 - MainThread - awscli.formatter - DEBUG - RequestId: 0a31c388-83de-11e5-b082-33dd0ab48d35
arn:aws:cloudformation:eu-west-1:429230952994:stack/ec2-bootstrapped-webserver/0a3ff450-83de-11e5-8605-50a68645b2d2
$
```

## Tools

### JSON Tools 

#### Validators

* JSONLint - The JSON Validator: http://jsonlint.com/
* JSON Validator: http://www.freeformatter.com/json-validator.html
* JSON formater and validator: http://jsonformatter.curiousconcept.com/

#### Viewers

* JQ - Lightweight and flexible command-line JSON processor: http://stedolan.github.io/jq/

#### Sublime editor plugins

* Pretty JSON: https://github.com/dzhibas/SublimePrettyJson
* Cform (CloudFormation syntax): https://github.com/beaknit/cform

## Documentation

* CloudFormation User-guide: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html
* Developer Tools: http://aws.amazon.com/developertools/AWS-CloudFormation?browse=1
* Official public articles and tutorials: http://aws.amazon.com/cloudformation/aws-cloudformation-articles-and-tutorials/
* CFN Blog: https://blogs.aws.amazon.com/application-management/blog/tag/CloudFormation

## Cloud-Init

Cloud-Init was created by Canonical, official documentation can be found here (https://cloudinit.readthedocs.org/en/latest/).

It's basically a set of python scripts using boto library, that can be used to ease your bootstraping with EC2. It's not only exclusive to EC2, since it works for cloudstack, openstack, etc. 

In terms of CFN, the CFN helper scripts use cloud-init under the hood to take care of the communication with the AWS endpoints via HTTPS.

Additionally, they are responsible for:

* Executing user-data
* Set-up ssh keys in .ssh/authorized_keys
* Set-up mounting points for ephemeral disks (if existent)

## Helper Scripts

AWS CloudFormation includes a set of helper scripts (cfn-init, cfn-signal, cfn-get-metadata, and cfn-hup) that are based on cloud-init. You call these helper scripts from your AWS CloudFormation templates to install, configure, and update applications on Amazon EC2 instances that are in the same template.

### CFN-Init

* It runs as root and it uses sh shell
* The cfn-init helper script reads template metadata from the AWS::CloudFormation::Init key and acts accordingly to:

- Fetch and parse metadata from CloudFormation
- Install packages
- Write files to disk
- Enable/disable and start/stop services

The required parameters are "Region", "Stack" and "Resource". Ex:

```bash
/usr/local/bin/cfn-init --stack cfn-bridge 
                        --resource InstanceCRProcessor 
                        --region eu-west-1
```

Command workflow:

1. It connects to the CloudFormation regional endpoint through https and reads the template from that stack, going through the metadata (AWS::CloudFormation::Init key) of the specified Resource.
2. Runs the ConfigSets from the C (checks for "config" key if not specified)
3. Once the ConfigSets are executed, it connects to an S3 signed-url via a regional s3 bucket, but I'm not sure about the reason why.

### CFN-Hup

The cfn-hup helper is a daemon that detects changes in resource metadata and runs user-specified actions when a change is detected. This allows you to make configuration updates on your running Amazon EC2 instances through the UpdateStack API action.

It has 2 configuration files (stored in /etc/cfn/ when installed through aws-cfn-bootstrap package for linux. Although it's installed by default in Amazon Linux):

* cfn-hup.conf: Contains Stack name and AWS credentials that the cfn-hup daemon targets. Example of /etc/cfn/cfn-hup.conf:

```Ini
[main]
stack=arn:aws:cloudformation:eu-west-1:123123123123:stack/openvpn/bdffdf60-df18-11e5-ae2e-50faeb5524d2
region=eu-west-1
```

* hooks.conf: Contains the user actions that the cfn-hup daemon calls periodically. The hooks configuration file is loaded at cfn-hup daemon startup only, so new hooks will require the daemon to be restarted. A cache of previous metadata values is stored at /var/lib/cfn-hup/data/metadata_db (not human readable)—you can delete this cache to force cfn-hup to run all post.add actions again. Example of /etc/cfn/hooks.d/cfn-auto-reloader.conf: 

```Ini
[cfn-auto-reloader-hook]
triggers=post.update
path=Resources.VPNInstanceVPC1.Metadata.AWS::CloudFormation::Init
action=/opt/aws/bin/cfn-init --stack openvpn --resource VPNInstanceVPC1 --configsets InstallAndRun --region eu-west-1
runas=root
```

Daemon workflow:

1. Once started, the daemon checks /etc/cfn/cfn-hup.conf for stacks to check.
2. Daemon connects to the regional CloudFormation endpoint via HTTPS to retrieve the meta-data from those stacks.
3. If the HTTP header from response has a different 'x-amzn-requestid', daemon checks hooks in /etc/cfn/hooks.d/ for triggers related to the new stack state. If yes, the "action" is executed. Normally it's good practice to add the cfn-init to run here, just like it's set-up in user-data.
4. Daemon keeps running and checking the resources every 15 minutes for modifications in the metadata and repeats step 3. In case you want to customize the 15-minute execution interval, you can change this value in /opt/aws/bin/cfn-hup, on line 78 (interval variable). 

ATTENTION: cfn-hup does not send any sort of signals to CloudFormation, it makes no difference to the stack, so stack update completes and that's it, then the daemon runs and executes whatever actions it is configured to, every N minutes (defined in interval, 15 by default).

### CFN-Get-Metadata

A way to retrieve the metadata from a resource inside a stack, to be used by the cfn-get-metadata helper script on the instances. It can be useful to set-up the userdata of an instance.

* It retrieves the values in a Json (unlike aws cloudformation cli commands). Requires:

    - Credentials (Access Key and Secret Key)
    - Region
    - Stack
    - Resource

Example:

```bash
$ cfn-get-metadata --access-key XXXX --secret-key XXXX 
                   --stack ec2-bootstrapped-webserver 
                   --resource WebServerSecurityGroup 
                   --region eu-west-1
{
    "Object1": "whatever1",
    "Object2": "whatever2"
}
```

If using the -f to pass the credential-file parameter, it must have the following format (that's different than the typical cli credential file in ~/.aws/credentials):

```Ini
AWSAccessKeyId=XXXXXXXX
AWSSecretKey=XXXXXXXX
```

Command workflow:

1. It connects to the CloudFormation regional endpoint through https and reads the template from that stack, retrieving the metadata of the specified resource.
2. It disconnects from the CloudFormation regional endpoint

### CFN-Signal

A way to send signals to a resource in the stack (like a WaitConditionHandle, as part of a WaitCondition resource, or a CreationPolicy attribute). It's used with the command cfn-signal and it can send customized error messages to stack too (-r or --reason attributes).

If you do not specify region, it tries to send the signal to the default region (us-east-1).

Requires:

* Region
* Stack
* Resource
* waitconditionhandle.url (only if signaling a wait condition handle)

Example to signal a Creation Policy: 

```bash
$ sudo /opt/aws/bin/cfn-signal --stack openvpn   
                               --resource VPNInstanceVPC1          
                               --region eu-west-1
```

Example for a WaitConditionHandle:

```bash
$ sudo /opt/aws/bin/cfn-signal --success|-s signal.to.send \
        --reason|-r resource.status.reason \
        --data|-d data \
        --id|-i unique.id \
        --exit-code|-e exit.code \
        waitconditionhandle.url
```

Command workflow:

1. If the unique id (cfn-signal -i) is not passed via the parameters, the command checks the current instance id in 169.254.169.254/latest/meta-data/instance-id

2. Then there are 2 possible behavious:
 -- If signalling a CreationPolicy, it connects to the CFN regional endpoint 
 -- If signalling a WaitConditionHandle, it connects to the wait-condition handle URL, which is actually a CNAME to a regional s3 bucket signed-url

3. It posts a json-formatted response through a HTTP Request (PUT) to that pre-signed s3 URL. The Json must contain "Status", "UniqueId", "Data" and "Reason". Ex:

```json
{
  "Status" : "StatusValue",
  "UniqueId" : "instance-id",
  "Data" : "Some Data",
  "Reason" : "Some Reason"
}
```

## Custom Resources

* It's done with the AWS::CloudFormation::CustomResource or Custom::String resource type
* It requires a ServiceToken property inside the CFN resource in template, it can define either a SNS topic or a Lambda function.
* CloudFormation sends requests to the Custom Resources in a JSON format that requires many fields, like RequestType (create/update/delete), ResponseURL(s3 bucket pre-signed url), StackID, RequestID, resourcetype, ResourceProperties, LogicalResourceId, etc. Here's an example of a Custom Resource Request Object:

```json
{
   "RequestType" : "Create",    <=== automatically filled
   "ResponseURL" : "http://pre-signed-S3-url-for-response",   <=== automatically filled
   "StackId" : "arn:aws:cloudformation:us-west-2:EXAMPLE/stack-name/guid",   <=== automatically filled
   "RequestId" : "unique id for this create request",
   "ResourceType" : "Custom::TestResource",
   "LogicalResourceId" : "MyTestResource",
   "ResourceProperties" : {
      "Name" : "Value",
      "List" : [ "1", "2", "3" ]
   }
}
```

The custom resource provider processes the AWS CloudFormation request and returns a response of SUCCESS or FAILED to the pre-signed URL.

* The Custom Resource Response Object CAN INCLUDE the output data provided by the resource. Example:

```json
{
   "Status" : "SUCCESS",
   "PhysicalResourceId" : "TestResource1",
   "StackId" : "arn:aws:cloudformation:us-west-2:EXAMPLE:stack/stack-name/guid",
   "RequestId" : "unique id for this create request",
   "LogicalResourceId" : "MyTestResource",
   "Data" : {
      "OutputName1" : "Value1",
      "OutputName2" : "Value2",
   }
}
```

* After getting a response, AWS CloudFormation proceeds with the stack operation according to the response. Any output data from the custom resource is stored in the pre-signed URL location. The template developer can retrieve that data by using the Fn::GetAtt function.

### Types of Custom Resource

#### SNS + EC2 instance (aws-cfn-resource-bridge)

* It's sent to an SNS that must be subscribed to an SQS queue. This SQS queue must contain a role that contains a policy allowing the action "SQS:SendMessage" to the ARN of the queue from the "aws:SourceArn" of the SNS topic.
* That being done, the custom resource must run in an EC2 instance. There's a framework called aws-cfn-resource-bridge (https://github.com/aws/aws-cfn-resource-bridge) that makes things easier.
* Must make sure the instance that runs aws-cfn-resources-bridge framework has internet access in order to be able to access the CloudFormation endpoints via HTTPS and to send the signals (cfn-signal) to the WaitConditionHandler, as well as executing the cfn-init to run the config inside the Metadata of the template (AWS::CloudFormation::Init).
* The instance must contain a IamInstanceProfile property with a "AWS::IAM::InstanceProfile" that contains a Role which is going to be a "sts:AssumeRole" that contains policies allowing sqs:* (or at least to "sqs:ChangeMessageVisibility", "sqs:DeleteMessage" and "sqs:ReceiveMessage"). It should also contain the actions allowing other possible API calls that are going to be used by the Custom Resource.
* If the script in the sections of cfn-resource-bridge.conf has any sort of errors, it won't work and won't post the message to the SQS queue, the error is going to be "Failed to create resource. Unknown Failure" in the Custom Resource error in the CFN events.

Here is the full work flow:

1. SNS ==> Subscribes to an SQS queue.
2. EC2 Instance checks the SQS queue with the aws-cfn-resource-bridge framework and act accordingly to the JSON definition there. 
3. Response is sent by cfn-bridge through a PUT via HTTPS on the ResponseURL (pre-signed S3 bucket) 

#### Lambda

* AWS CloudFormation calls a Lambda API to invoke the function ("Action": ["lambda:InvokeFunction"]) and passes all the request data to the function, such as the request type and resource properties. 
* Lambda function must contain an execution role ("AWS::IAM::Role") that contains a ["sts:AssumeRole"] as an action to the "lambda.amazonaws.com" service. Aditionally: 
    - It must also contains the policies allowing the actions "logs:CreateLogGroup","logs:CreateLogStream","logs:PutLogEvents" to "arn:aws:logs:*:*:*"
    - Must contain allowed action "cloudformation:DescribeStacks" to "*"
* The response from Lambda to CloudFormation must be sent to the "event.ResponseURL", which is sent within the Custom Resource sent from CloudFormation to Lambda. It is a pre-signed S3 URL.
* Ideally, it must also implement a response for a stack deletion as well (event.RequestType == "Delete"), sending a response to the responseURL with a STATUS of "SUCCESS" too, otherwise the custom resource will timeout and fail during stack deletion.

Here is the full work flow:

CFN Stack ==> (API call to lambda::InvokeFunction) ==> Lambda function with an execution role with the right permissions (logs:* and cloudformation:DescribeStacks).

Lambda function ==> API call (PUT via HTTPS) to ResponseURL (pre-signed S3 bucket) (can contain a "Data")

## LaunchConfiguration updates

When you update a property of the LaunchConfiguration resource, AWS CloudFormation deletes that resource and creates a new launch configuration with the updated properties and a new name. 

This update action does not deploy any change across the running Amazon EC2 instances in the auto scaling group. In other words, an update simply replaces the LaunchConfiguration so that when the auto scaling group launches new instances, they will get the updated configuration, but existing instances continue to run with the configuration that they were originally launched with. This works the same way as if you made similar changes manually to an auto scaling group.

If you want to update existing instances when you update the LaunchConfiguration resource, you must specify an update policy attribute for the AWS::AutoScaling::AutoScalingGroup resource. For more information, see UpdatePolicy (ASG Rolling Updates).

## ASG Rolling Updates

* It's done through the UpdatePolicy

Once initiated, it adds an event to CFN with something like the following:

```
Rolling update initiated. Terminating N obsolete instance(s) in batches of N,
 while keeping at least N instance(s) in service. Waiting on resource signals 
 with a timeout of PTXXXM when new instances are added to the autoscaling group.
```

* PauseTime: If you specify the WaitOnResourceSignals property, the PauseTime becomes the amount of time to wait until the ASG receives the required number of signals. It's recommended to enter a value that is enough time for the instances to run their UserData scripts in time.

If WaitOnResourceSignals+PauseTime is specified, you gotta make sure you have added enough time to the PauseTime to be able to receive the amount of signals. Otherwise, CloudFormation is going to rollback, with the error "Failed to receive X resource signal(s) within the specified duration". However, during rollback process, if you only made "replacement" kind of updates in your LC, it's going to go through the rollback process by respecting the updatepolicy too, so it will fail again which will result in UPDATE_ROLLBACK_FAILURE.

If you use the "Continue Rollback Update" option, enough time after the amount of time you think your instances would be able to finish what they are doing and send the signal to CFN, than it should work just fine (and initate the ROLLBACK_COMPLETE_CLEANUP process, which would remove the unused resources).

* MinSuccessfulInstancesPercent:

It was released by the request of big services like Lambda that launch hundreds of instances and have a handful that fail; that shouldn't cause a rollback so the min percentage was added to Rolling Updates. This is a big feature of rolling updates.

Basically, you simply set the percentage of instances you need up during the update and by the end of the update (regarless if it timed out for some instances), it checks if the amount of signals was able to satisfy the specified percentage. Here's an example of an error message in case it doesn't satisfy:

```
  Received 1 FAILURE signal(s) out of 9. Unable to satisfy 95% MinSuccessfulInstancesPercent requirement
```

In the case above, it will simply initiate the rollback, since it didn't satisfy the wanted percentage.

* AutoScalingScheduledAction -> IgnoreUnmodifiedGroupSizeProperties:

Set as false by default. If set as true, it ignores any group size property differences (min size, max size, or desired capacity) between your current Auto Scaling group and the current AWS::AutoScaling::AutoScalingGroup resource of your stack.

How can you make the update with zero downtime?

First, you must make sure the ASG is running behind an ELB already, so they can have an endpoint set-up in their DNS to make the ELB to balance the traffic load among the ASG instances.

If not, a blue-green deployment method must be created. So you can replicate the stack to another one, and the ELB name(s) must be added to the ASG property "LoadBalancerNames", PLUS the HealthCheckType (ELB instead of EC2) and HealthCheckGracePeriod must be set.

Note from ASG docs: If you have attached a load balancer to your Auto Scaling group, you can optionally have Auto Scaling include the results of Elastic Load Balancing health checks when determining the health status of an instance. After you add ELB health checks, Auto Scaling also marks an instance as unhealthy if Elastic Load Balancing reports the instance state as OutOfService. 

* If DesiredCount is not set on the ASG, CFN won't check the modified number of running instances on stack while performing an update.

## Stack CLEANUP Process

CloudFormation always wants to be able to roll back, so it'll create new resources to replace the old ones. If the update works, the old
resources are deleted in the CLEANUP process. If the update fails, the old resources are still around. This applies for resources that require replacement.

What happens during Cleanup after stack update?

It deletes the resources that are not used anymore after an update is successfully completed. For example: Let's say you need to update a LaunchConfiguration, which is a resource that can't be edited so it has to be replaced. What CFN does is that it creates a new one, and once the new one is created successfully and replaced on the stack, it initiates the CLEANUP process to delete the old one.

Why does CFN try to give each resource a unique name?

The main reason is to be able to rollback. So it needs unique ids to be able to track old and new resources.

If you're updating a resource that can't be edited, CFN creates a new one to replace it. However, as per example above, if you are creating a LaunchConfiguration and it already has a defined name, it won't be possible to create a new one with the same name. Therefore, CloudFormation creates a new one with a new random name. 

In case you have an ASG associated with this LC via a Ref function (and not hard-coded), than CFN replaces it for you as well but the update on the instances will only occur if you have a UpdatePolicy set-up.

## Stack Policies

* Applies only to stack updates, to prevent accidental updates to certain stack resources. It's basically a way to protect the stack from bad updates the user may perform on resources that are too sensitive.
* If added, stack policies will deny updates on all resources by default. So everything must be allowed individually in the policy in order to perfom an update.

