
FROM --platform=linux/amd64 ubuntu:jammy-20230804

RUN apt-get update && apt-get install -y build-essential python3-pip wget && \
    rm -rf /var/lib/apt/lists/*

SHELL ["/bin/bash", "-c"]

ENV PATH="~/miniconda3/bin:${PATH}"
ARG PATH="~/miniconda3/bin:${PATH}"

RUN mkdir -p ~/miniconda3 && \
    wget https://repo.anaconda.com/miniconda/Miniconda3-py310_23.5.2-0-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh && \
    bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3 && \
    rm -rf ~/miniconda3/miniconda.sh && \
    ~/miniconda3/bin/conda init bash && \
    conda create -n unity-mla python=3.9.7 -y && \
    source ~/miniconda3/etc/profile.d/conda.sh && \
    conda activate unity-mla && \
    conda config --add channels pytorch && \
    conda install pytorch torchvision -c pytorch -y && \
    conda install grpcio h5py -y && \
    pip install mlagents==0.30.0 && \
    pip install numpy==1.23.5 && \
    pip install protobuf==3.20.*

# COPY entrypoint.sh /entrypoint.sh
# ENTRYPOINT ["/entrypoint.sh"]
