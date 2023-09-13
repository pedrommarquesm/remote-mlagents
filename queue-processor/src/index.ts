import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  type DeleteMessageCommandOutput,
  type ReceiveMessageCommandInput,
  type DeleteMessageCommandInput,
} from "@aws-sdk/client-sqs";
import Docker from "dockerode";
import startNewContainer from "./docker/start";

const pollDelay = 5000;
const maxNumberOfContainers = 3;

const region = "eu-central-1";
const AWS_ACCOUNT_ID = "866645210820";
const GYM_QUEUE_NAME = "vinci-training-gym";

const queueUrl = `https://sqs.${region}.amazonaws.com/${AWS_ACCOUNT_ID}/${GYM_QUEUE_NAME}`;

const sqs = new SQSClient({ region });
const docker = new Docker({ socketPath: "/var/run/docker.sock" }); // TODO: replace with the env var: DOCKER_SOCKET_PATH

async function getActiveContainers(): Promise<Docker.ContainerInfo[]> {
  const containers = await docker.listContainers();
  return containers.filter((container) => container.Image === "script-runner");
}

async function pollQueue() {
  console.log("pollQueue()");
  let pollImmediatly = false;
  try {
    const activeContainers = await getActiveContainers();
    const numOfActiveContainer = activeContainers.length;
    console.log("Active Container: ", numOfActiveContainer);
    const freeContainerSlots = maxNumberOfContainers - numOfActiveContainer;
    if (numOfActiveContainer < maxNumberOfContainers) {
      const params: ReceiveMessageCommandInput = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: freeContainerSlots,
        WaitTimeSeconds: 5, // Enables long polling, waiting up to 20 seconds (maximum time)
      };

      console.log("Polling queue");
      const data = await sqs.send(new ReceiveMessageCommand(params));
      console.log("received data:", data);

      if (data.Messages) {
        // if we got a message, we want to poll right away (if under containers limit)
        pollImmediatly = numOfActiveContainer + 1 < 3;
        const numOfMessages = data.Messages.length;
        console.log(`received #${numOfMessages}messages:`);

        const deletePromises: Promise<DeleteMessageCommandOutput>[] = [];
        data.Messages.forEach((message, i) => {
          console.log(`message ${i}: ${message}`);
          const deleteParams: DeleteMessageCommandInput = {
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          };

          deletePromises.push(sqs.send(new DeleteMessageCommand(deleteParams)));
        });

        Promise.allSettled(deletePromises);

        // const body = message.Body ? JSON.parse(message.Body) : undefined;

        // ... Process the SQS message as needed ...

        // try {
        // const containerName = `script-runner-${Date.now()}`;
        // console.log("creating container with name:", containerName);
        //   const startResult = await startNewContainer(docker, containerName);

        //   console.log("startResult: ", startResult);

        // } catch (error) {
        //   console.error("error starting new container, named: ", containerName);
        // }
      }

      console.log("end polling queue, no message");
    }
    if (pollImmediatly) {
      console.log("polling now");
      pollQueue();
    } else {
      console.log("polling now in pollDelay");
      setTimeout(pollQueue, pollDelay);
    }
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

pollQueue();
// function test() {
//   const containerName = `script-runner-${Date.now()}`;
//   const runId = Date.now().toString();

//   startNewContainer(docker, containerName, runId);
// }

// console.log("test1");
// test();
// console.log("test2");
// test();
// console.log("test3");
// test();
