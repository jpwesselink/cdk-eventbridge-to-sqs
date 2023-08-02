# cdk-eventbridge-to-sqs

This is a CDK construct library that allows you to easily create an EventBridge rule that sends events to an SQS queue.

Why not use [AWS Solutions constructs `aws-eventbridge-sqs`](https://docs.aws.amazon.com/solutions/latest/constructs/aws-eventbridge-sqs.html)?

Because it doesn't support message group id.

So, that's why.

## Documentation

[API Reference](./API.md)

## Usage

### Install

```bash
npm install cdk-eventbridge-to-sqs
```

### Import

```typescript
import { EventbridgeToSqs } from "cdk-eventbridge-to-sqs";
```

### Examples

#### Create an eventbus and a queue, and connect them

```typescript
const { queue, eventBus } = new EventbridgeToSqs(this, "EventbridgeToSqs");
```

#### Create an eventbus and a queue with custom names, and connect them

```typescript
const { queue, eventBus } = new EventbridgeToSqs(this, "EventbridgeToSqs", {
  eventBusProps: {
    eventBusName: "MyEventBus",
  },
  queueProps: {
    queueName: "MyQueue",
  },
});
```

#### Create an eventbus, a queue and a dead letter queue with custom names, and connect them

```typescript
const { queue, eventBus } = new EventbridgeToSqs(this, "EventbridgeToSqs", {
  eventBusProps: {
    eventBusName: "MyEventBus",
  },
  queueProps: {
    fifo: true,
  },
  deadLetterQueueProps: {
    fifo: true,
  },
  deployDeadLetterQueue: true,
  messageGroupId: "MyMessageGroupId",
});
```

#### Connect an existing eventbus and queue

```typescript
declare const queue: Queue;
declare const eventBus: EventBus;

new EventbridgeToSqs(this, "EventbridgeToSqs", {
  existingEventBusInterface: eventBus,
  existingQueueObj: queue,
});
```

#### Custom event rule filter pattern

```typescript
declare const queue: Queue;
declare const eventBus: EventBus;

new EventbridgeToSqs(this, "EventbridgeToSqs", {
  existingEventBusInterface: eventBus,
  existingQueueObj: queue,
  eventRuleFilterPattern: {
    detailType: ["MyDetailType"],
    source: ["MySource"],
  },
});
```
