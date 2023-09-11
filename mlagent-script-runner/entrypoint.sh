#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status.

echo "passed arguments: "$@

echo "Debug: Running entrypoint script"

# Source the Conda shell script to make the `conda` command available
source ~/miniconda3/etc/profile.d/conda.sh || echo "Failed source command"

echo "Debug: about to run conda activate"

# Activate the Conda environment
conda activate unity-mla || echo "Failed activate command"

echo "Debug: after run conda activate"

ls

ls -la

echo "ls unity volume"
ls /unity-volume
echo "after ls unity volume"

# sleep 5

# echo "after sleep 5"


# tensorboard --logdir /unity-volume/results --host 0.0.0.0

# mlagents-learn config/trainer_config.yaml --env=../../projects/Cats/CatsOnBicycles.app --run-id=cob_1 --train
# pass all arguments
mlagents-learn $@

# Execute additional commands within the activated environment
# exec "mlagents-learn --help"