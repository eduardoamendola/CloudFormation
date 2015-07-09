#AWS CloudFormation

Collection of templates and docs related to Cloud Formation during my studies

## Notes 

### Features

* Template-based
* Only "Resources" is mandatory in template
* A few resourcers can't be created through CFN, such as KeyPairs, R53 HostedZones, etc

### Limitations

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
