# The image every proof is checked in when the backend runs with LEAN_SANDBOX=docker.
#
#   docker build -f docker/lean.Dockerfile -t swappr-lean .       (from the proof-puzzle/ folder)
#
# The Lean project (lean-project/) is compiled into the image, so a run only mounts the one proof file, read-only.
# backend/proof.ts starts it with --network none, 1 GB memory, 1 CPU, 64 processes, a read-only filesystem, no Linux
# capabilities and a hard kill after 15 seconds, and throws the container away afterwards.
FROM debian:bookworm-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates git coreutils \
 && rm -rf /var/lib/apt/lists/*

ENV ELAN_HOME=/opt/elan
ENV PATH=/opt/elan/bin:$PATH
RUN curl -sSf https://raw.githubusercontent.com/leanprover/elan/master/elan-init.sh | sh -s -- -y --default-toolchain none

COPY lean-project /work
WORKDIR /work
# downloads the toolchain pinned in lean-toolchain and compiles the Puzzle library
RUN lake build

# players run as nobody, not root
RUN chmod -R a+rX /work /opt/elan
USER nobody
