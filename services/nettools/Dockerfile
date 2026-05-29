FROM ubuntu:24.04
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    iputils-ping \
    netcat-openbsd \
    dnsutils \
    nmap \
    traceroute \
    iproute2 \
    tcpdump \
    && rm -rf /var/lib/apt/lists/*
CMD ["bash"]
