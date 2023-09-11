import type Docker from "dockerode";

async function startNewContainer(
  docker: Docker,
  containerName: string,
  runId: string
) {
  console.log("Container", containerName, ": creating");
  console.log("env var HOST_PATH:", process.env.HOST_PATH);

  if (process.env.HOST_PATH === undefined || process.env.HOST_PATH === "")
    throw new Error("env var HOST_PATH not defined");

  const container = await docker.createContainer({
    Image: "mlagent-script-runner:latest",
    name: containerName,
    Tty: true,
    Cmd: [
      "--results-dir=/unity-volume/results",
      "/unity-volume/trainer_config.yaml",
      "--env=/unity-volume/game-binaries/ShooterGraphics.x86_64",
      `--run-id=${runId}`,
      "--no-graphics",
    ],
    HostConfig: {
      Binds: [`${process.env.HOST_PATH}/unity-volume:/unity-volume`],
      PortBindings: {
        "5004/tcp": [{ HostPort: "5004" }],
        "6006/tcp": [{ HostPort: "6006" }],
      },
      //   AutoRemove: true,
    },
  });

  console.log("Container", containerName, ": attaching");
  container.attach(
    { stream: true, stdout: true, stderr: true },
    (err, stream: NodeJS.ReadWriteStream | undefined) => {
      console.log("Container", containerName, ": attach callback");
      if (err) {
        // Handle error
        console.error(
          "Container",
          containerName,
          ": attach callback error:",
          err
        );
        return;
      }
      if (stream) {
        stream.on("data", () => {
          // console.log("Container", containerName, "Received log:", chunk);
        });
        stream.on("end", () => {
          console.log("Container", containerName, ": stream end");
        });
        // stream.on("close", () => {
        //   console.log("Container", containerName, ": stream close");
        // });
        stream.on("error", (err) => {
          console.error("Container", containerName, ": stream error: ", err);
        });
        stream.on("exit", (err) => {
          console.log("Container", containerName, ": stream exit: ", err);
        });
      }
    }
  );

  console.log("Container", containerName, ": starting");
  return await container.start();
}

export default startNewContainer;
