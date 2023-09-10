```
docker run -it --rm --name mlagent-script-runner \
    --mount type=bind,source="$(pwd)"/unity-volume,target=/unity-volume \
    --platform linux/amd64 \
    -p 5004:5004 \
    -p 6006:6006 \
    mlagent-script-runner:latest --results-dir=/unity-volume/results \
    /unity-volume/trainer_config.yaml --env=/unity-volume/TestBuildServerLogs.x86_64 --run-id=testid --no-graphics
```

# 1. Build the images

Run both scripts:

```bash
docker build -t queue-processor ./queue-processor
```

```bash
docker build -t mlagent-script-runner ./mlagent-script-runner
```

# 2. Start docker containers up!

Don't forget to open Docker Desktop before running the following command:

### Linux

```bash
HOST_PATH=$(pwd) docker compose up
```

### Windows

```bash
set HOST_PATH=%cd%
docker-compose up
```

---

# BEFORE RUNNING `docker-compose up`:

### Ensure the environment variable that defines the docker sock location is defined!

#### This is vital, since the queue processor container won't be able to comunicate with the script processor containers!

## Setting Environment Variables for Docker Compose

This document outlines the steps to set an environment variable — specifically `DOCKER_SOCKET_PATH` — which is required for Docker Compose to properly map the Docker socket path based on the host operating system (Linux or Windows).

## On Linux

### Using the Terminal

1. Open your terminal.
2. Run the following command to set the `DOCKER_SOCKET_PATH` environment variable:

   ```bash
   export DOCKER_SOCKET_PATH=/var/run/docker.sock
   ```

   This will set the environment variable for the current session.

### Making it Persistent Across Sessions

1. Open your `~/.bashrc` file for editing. You can use any text editor you are comfortable with. For example:

   ```bash
   nano ~/.bashrc
   ```

2. Add the `export` command at the end of the file:

   ```bash
   export DOCKER_SOCKET_PATH=/var/run/docker.sock
   ```

3. Save the file and exit the editor.
4. To apply the changes, you can either:
   - Run `source ~/.bashrc`
   - Or restart your terminal session.

## On Windows

### Using Command Prompt (cmd)

1. Open Command Prompt as an administrator.
2. Run the following command:

   ```cmd
   setx DOCKER_SOCKET_PATH "\\\\.\\pipe\\docker_engine"
   ```

### Using PowerShell

1. Open PowerShell as an administrator.
2. Run the following command:

   ```powershell
   [Environment]::SetEnvironmentVariable("DOCKER_SOCKET_PATH", "\\\\.\\pipe\\docker_engine", [EnvironmentVariableTarget]::Machine)
   ```

### Making it Persistent

In both Command Prompt and PowerShell methods above, the environment variable is set in a way that will be persistent across sessions and reboots.

## Verifying the Environment Variable

### On Linux

To verify that the environment variable is set correctly, open the terminal and run:

```bash
echo $DOCKER_SOCKET_PATH
```

### On Windows

In Command Prompt or PowerShell, you can use the following command to verify:

```cmd
echo %DOCKER_SOCKET_PATH%
```

Or in PowerShell:

```powershell
echo $env:DOCKER_SOCKET_PATH
```

If everything is set up correctly, this should display the path you've set for the Docker socket.
