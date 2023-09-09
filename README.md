```
docker rm test.image.basic.v.0.1 && docker rmi test.image.basic.v.0.1
```

```
docker build -t test.image.basic.v.0.1 .
```

```
docker run -it --name test.image.basic.v.0.1 \
    --mount type=bind,source="$(pwd)"/unity-volume,target=/unity-volume \
    --platform linux/amd64 \
    -p 5004:5004 \
    -p 6006:6006 \
    test.image.basic.v.0.1:latest --results-dir=/unity-volume/results \
    /unity-volume/trainer_config.yaml --env=/unity-volume/TestBuildServerLogs.x86_64 --run-id=testid --no-graphics --debug
```
