## ASG Rollout Update on CFN

1. Create a template that contains a LC (Launch Configuration), an ASG (Auto Scaling Group) with 10 instances max, 4 instances minimum and 7 desired.
2. Configure the UpdatePolicy attribute to do rolling updates in batchs of 3, minimum online 2
3. Play with different values on UpdatePolicy

# Notes

* If you specify the WaitOnResourceSignals property, the PauseTime becomes the amount of time to wait until the ASG receives the required number of signals. It's recommended to enter a value that is enough time for the instances to run their UserData scripts in time.