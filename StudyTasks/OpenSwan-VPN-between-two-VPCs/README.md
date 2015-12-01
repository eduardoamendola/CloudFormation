## Setup an OpenSwan connection between two VPCs

[Done]

* Create a template that has two VPCs with 1 instance in each setup with OpenSwan. 
* Create extra instances in each setup, to test network-to-network vpn through VPN instances created above
* You should establish the OpenSwan configuration and allow host-to-host connectivity between VPN instances
* You should establish the OpenSwan configuration and allow site-to-site connectivity between instances in either VPC. Minimum number of instances to establish this is 4: 2 OpenSwan, 2 test instances. 

## Notes about solution 

* Circular Dependencies was a big issue on this template. The OpenSwan configuration requires the IP addresses of both VPN instances to make the connection, so the Metadata of those instances would depend on each other's creation. To work around this, I decided to create a child-stack within the template to create the EIPs and the SGs in paralel, and then associate these EIPs/SGs with the instances with "AWS::EC2::EIPAssociation" by using an AllocationId provided via Outputs. 
* I have also used the EIPAssociation as a DependsOn in the instances, to avoid them to start creation before the child-stack finishes creating the EIPs/SGs for them.
* This whole implementation could be done much more easily with AWS::EC2::VPCPeeringConnection, but this was done for learning purposes. This is how you would automate connectivity between 2 VPCs before the VPCPeering service was released by AWS.
* The Extra instances were the easiest part, as they don't really need anything other than a static route pointing to the point-b vpn network by using their regular gateway.