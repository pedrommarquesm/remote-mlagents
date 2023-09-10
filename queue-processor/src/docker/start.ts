import type Docker from "dockerode";
import path from "path";

const config = {
  Image: "mlagent-script-runner:latest",
  name: "test.image.basic.v.0.1",
  Tty: true,
  Cmd: [
    "--results-dir=/unity-volume/results",
    "/unity-volume/trainer_config.yaml",
    "--env=/unity-volume/TestBuildServerLogs.x86_64",
    "--run-id=testid",
    "--no-graphics",
  ],
  HostConfig: {
    Binds: [`${path.resolve(process.cwd(), "unity-volume")}:/unity-volume`],
    PortBindings: {
      "5004/tcp": [{ HostPort: "5004" }],
      "6006/tcp": [{ HostPort: "6006" }],
    },
  },
  NetworkingConfig: {
    EndpointsConfig: {
      // Network name, you might need to configure this
      host: {},
    },
  },
};

async function startNewContainer(docker: Docker, containerName: string) {
  console.log("creating container with name: ", containerName);
  console.log("bing: ", path.resolve(process.cwd(), "../unity-volume"));
  console.log("env var HOST_PATH:", process.env.HOST_PATH);
  if (process.env.HOST_PATH === undefined)
    throw new Error("env var HOST_PATH not defined");

  const container = await docker.createContainer({
    Image: "mlagent-script-runner:latest",
    name: containerName,
    Tty: true,
    Cmd: [
      "--results-dir=/unity-volume/results",
      "/unity-volume/trainer_config.yaml",
      "--env=/unity-volume/game-binaries/TestBuildServerLogs.x86_64",
      "--run-id=testid",
      "--no-graphics",
    ],
    HostConfig: {
      Binds: [`${process.env.HOST_PATH}/unity-volume":/unity-volume`],
      PortBindings: {
        "5004/tcp": [{ HostPort: "5004" }],
        "6006/tcp": [{ HostPort: "6006" }],
      },
      //   AutoRemove: true,
    },
  });

  console.log("starting container with name: ", containerName);
  return await container.start();
}

export default startNewContainer;
