# Stage 1: Builder
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod ./
COPY *.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o server .

# Stage 2: Runner
FROM alpine:3.19
WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata

COPY --from=builder /app/server ./server

RUN mkdir -p data uploads

EXPOSE 8080

CMD ["./server"]
