# Use the official Ubuntu base image
FROM ubuntu:latest
LABEL authors="Bhishman Desai"

# Update the package list and install prerequisites
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    software-properties-common \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    wget \
    llvm \
    libncurses5-dev \
    libncursesw5-dev \
    xz-utils \
    tk-dev \
    libffi-dev \
    liblzma-dev \
    python3-openssl \
    git && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install pyenv
RUN curl https://pyenv.run | bash

# Set environment variables for pyenv
ENV PATH="/root/.pyenv/bin:/root/.pyenv/shims:$PATH"
RUN echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc && \
    echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc && \
    echo 'eval "$(pyenv init --path)"' >> ~/.bashrc && \
    echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bashrc

# Install multiple Python versions using pyenv
RUN /root/.pyenv/bin/pyenv install 3.8.16 && \
    /root/.pyenv/bin/pyenv install 3.9.14 && \
    /root/.pyenv/bin/pyenv install 3.10.12 && \
    /root/.pyenv/bin/pyenv install 3.11.5 && \
    /root/.pyenv/bin/pyenv install 3.12.0

# Set global Python versions
RUN /root/.pyenv/bin/pyenv global 3.12.0 3.11.5 3.10.12 3.9.14 3.8.16

# Verify installations
RUN node -v && \
    /root/.pyenv/bin/pyenv versions