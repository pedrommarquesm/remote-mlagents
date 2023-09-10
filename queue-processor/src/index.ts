import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import Docker from "dockerode";
import startNewContainer from "./docker/start";

// const sqs = new SQSClient({ region: "us-west-2" });
const docker = new Docker({ socketPath: "/var/run/docker.sock" }); // TODO: replace with the env var: DOCKER_SOCKET_PATH

const queueUrl = "your-sqs-queue-url-here";

async function getActiveContainers(): Promise<Docker.ContainerInfo[]> {
  const containers = await docker.listContainers();
  return containers.filter((container) => container.Image === "script-runner");
}

// async function pollQueue() {
//   try {
//     const activeContainers = await getActiveContainers();

//     if (activeContainers.length < 3) {
//       const params = {
//         QueueUrl: queueUrl,
//         MaxNumberOfMessages: 1,
//         WaitTimeSeconds: 20,
//       };

//       const data = await sqs.send(new ReceiveMessageCommand(params));

//       if (data.Messages) {
//         const message = data.Messages[0];
//         const body = message.Body ? JSON.parse(message.Body) : undefined;

//         // ... Process the SQS message as needed ...

//         const containerName = `script-runner-${Date.now()}`;
//         try {
//           const startResult = await startNewContainer(docker, containerName);

//           console.log("startResult: ", startResult);

//           const deleteParams = {
//             QueueUrl: queueUrl,
//             ReceiptHandle: message.ReceiptHandle,
//           };

//           await sqs.send(new DeleteMessageCommand(deleteParams));
//         } catch (error) {
//           console.error("error starting new container, named: ", containerName);
//         }
//       }
//     }

//     setTimeout(pollQueue, 5000);
//   } catch (err) {
//     console.error("An error occurred:", err);
//   }
// }

// pollQueue();

const containerName = `script-runner-${Date.now()}`;
const runId = Date.now().toString();

startNewContainer(docker, containerName, runId);
