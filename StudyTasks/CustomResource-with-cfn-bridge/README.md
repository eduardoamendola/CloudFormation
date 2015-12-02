## Use a Custom Resource to create and attach an EIP to an EC2 instance

1. Create a CFN stack using Custom Resource, 2 EC2 instances (in a default VPC) running Ubuntu, an EIP, and WaitConditions
2. One instance should process the messages for the Custom Resource. You should use Cloudformation::Init or a UserData script to set it up to work.
3. The second instance should simple be started. No configuration is needed.
4. The EIP should be created BUT NOT ATTACHED in the CFN template
5. The Custom Resource should be used to signal the first instance to attach the EIP to the second instance
6. The stack should successfully complete 

*  Please try to avoid copying and pasting for this exercise 
