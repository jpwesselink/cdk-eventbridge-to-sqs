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

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### EventbridgeToSqs <a name="EventbridgeToSqs" id="cdk-eventbridge-to-sqs.EventbridgeToSqs"></a>

#### Initializers <a name="Initializers" id="cdk-eventbridge-to-sqs.EventbridgeToSqs.Initializer"></a>

```typescript
import { EventbridgeToSqs } from 'cdk-eventbridge-to-sqs'

new EventbridgeToSqs(scope: Construct, id: string, props?: EventbridgeToSqsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqs.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqs.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqs.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps">EventbridgeToSqsProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-eventbridge-to-sqs.EventbridgeToSqs.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-eventbridge-to-sqs.EventbridgeToSqs.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk-eventbridge-to-sqs.EventbridgeToSqs.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps">EventbridgeToSqsProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqs.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-eventbridge-to-sqs.EventbridgeToSqs.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqs.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="cdk-eventbridge-to-sqs.EventbridgeToSqs.isConstruct"></a>

```typescript
import { EventbridgeToSqs } from 'cdk-eventbridge-to-sqs'

EventbridgeToSqs.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="cdk-eventbridge-to-sqs.EventbridgeToSqs.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqs.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqs.property.eventBus">eventBus</a></code> | <code>aws-cdk-lib.aws_events.IEventBus</code> | *No description.* |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqs.property.queue">queue</a></code> | <code>aws-cdk-lib.aws_sqs.Queue</code> | *No description.* |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqs.property.rule">rule</a></code> | <code>aws-cdk-lib.aws_events.Rule</code> | *No description.* |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqs.property.deadLetterQueue">deadLetterQueue</a></code> | <code>aws-cdk-lib.aws_sqs.DeadLetterQueue</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-eventbridge-to-sqs.EventbridgeToSqs.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `eventBus`<sup>Required</sup> <a name="eventBus" id="cdk-eventbridge-to-sqs.EventbridgeToSqs.property.eventBus"></a>

```typescript
public readonly eventBus: IEventBus;
```

- *Type:* aws-cdk-lib.aws_events.IEventBus

---

##### `queue`<sup>Required</sup> <a name="queue" id="cdk-eventbridge-to-sqs.EventbridgeToSqs.property.queue"></a>

```typescript
public readonly queue: Queue;
```

- *Type:* aws-cdk-lib.aws_sqs.Queue

---

##### `rule`<sup>Required</sup> <a name="rule" id="cdk-eventbridge-to-sqs.EventbridgeToSqs.property.rule"></a>

```typescript
public readonly rule: Rule;
```

- *Type:* aws-cdk-lib.aws_events.Rule

---

##### `deadLetterQueue`<sup>Optional</sup> <a name="deadLetterQueue" id="cdk-eventbridge-to-sqs.EventbridgeToSqs.property.deadLetterQueue"></a>

```typescript
public readonly deadLetterQueue: DeadLetterQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.DeadLetterQueue

---


## Structs <a name="Structs" id="Structs"></a>

### EventbridgeToSqsProps <a name="EventbridgeToSqsProps" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps"></a>

The properties for the EventbridgeToSqs class.

#### Initializer <a name="Initializer" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps.Initializer"></a>

```typescript
import { EventbridgeToSqsProps } from 'cdk-eventbridge-to-sqs'

const eventbridgeToSqsProps: EventbridgeToSqsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.deadLetterQueueProps">deadLetterQueueProps</a></code> | <code>aws-cdk-lib.aws_sqs.QueueProps</code> | Properties for the dead letter queue, if deployDeadLetterQueue is true. |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.deployDeadLetterQueue">deployDeadLetterQueue</a></code> | <code>boolean</code> | Whether to deploy a dead letter queue for the main queue. |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.enableQueuePurging">enableQueuePurging</a></code> | <code>boolean</code> | Whether to enable queue purging. |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.eventBusProps">eventBusProps</a></code> | <code>aws-cdk-lib.aws_events.EventBusProps</code> | Properties for the new event bus that will be created. |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.eventRuleFilterPattern">eventRuleFilterPattern</a></code> | <code>aws-cdk-lib.aws_events.EventPattern</code> | Event pattern to use for the event rule Defaults to an event pattern that matches all events in the same region as the event bus. |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.eventRuleProps">eventRuleProps</a></code> | <code>aws-cdk-lib.aws_events.RuleProps</code> | Properties for the new event rule that will be created. |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.existingEventBusInterface">existingEventBusInterface</a></code> | <code>aws-cdk-lib.aws_events.EventBus</code> | An existing event bus to bind the rule to. |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.existingQueueObj">existingQueueObj</a></code> | <code>aws-cdk-lib.aws_sqs.Queue</code> | Existing queue object to bind the event source to. |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.maxReceiveCount">maxReceiveCount</a></code> | <code>number</code> | Max receive count for the dead letter queue. |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.messageGroupId">messageGroupId</a></code> | <code>string</code> | The message group id to use for fifo queues. |
| <code><a href="#cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.queueProps">queueProps</a></code> | <code>aws-cdk-lib.aws_sqs.QueueProps</code> | Properties for the new queue that will be created, if no existing queue is provided. |

---

##### `deadLetterQueueProps`<sup>Optional</sup> <a name="deadLetterQueueProps" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.deadLetterQueueProps"></a>

```typescript
public readonly deadLetterQueueProps: QueueProps;
```

- *Type:* aws-cdk-lib.aws_sqs.QueueProps
- *Default:* None

Properties for the dead letter queue, if deployDeadLetterQueue is true.

---

##### `deployDeadLetterQueue`<sup>Optional</sup> <a name="deployDeadLetterQueue" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.deployDeadLetterQueue"></a>

```typescript
public readonly deployDeadLetterQueue: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to deploy a dead letter queue for the main queue.

---

##### `enableQueuePurging`<sup>Optional</sup> <a name="enableQueuePurging" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.enableQueuePurging"></a>

```typescript
public readonly enableQueuePurging: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to enable queue purging.

If true, the queue will be purged before deployment

---

##### `eventBusProps`<sup>Optional</sup> <a name="eventBusProps" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.eventBusProps"></a>

```typescript
public readonly eventBusProps: EventBusProps;
```

- *Type:* aws-cdk-lib.aws_events.EventBusProps
- *Default:* None

Properties for the new event bus that will be created.

---

##### `eventRuleFilterPattern`<sup>Optional</sup> <a name="eventRuleFilterPattern" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.eventRuleFilterPattern"></a>

```typescript
public readonly eventRuleFilterPattern: EventPattern;
```

- *Type:* aws-cdk-lib.aws_events.EventPattern
- *Default:* None

Event pattern to use for the event rule Defaults to an event pattern that matches all events in the same region as the event bus.

---

##### `eventRuleProps`<sup>Optional</sup> <a name="eventRuleProps" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.eventRuleProps"></a>

```typescript
public readonly eventRuleProps: RuleProps;
```

- *Type:* aws-cdk-lib.aws_events.RuleProps
- *Default:* None

Properties for the new event rule that will be created.

---

##### `existingEventBusInterface`<sup>Optional</sup> <a name="existingEventBusInterface" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.existingEventBusInterface"></a>

```typescript
public readonly existingEventBusInterface: EventBus;
```

- *Type:* aws-cdk-lib.aws_events.EventBus
- *Default:* A new event bus will be created

An existing event bus to bind the rule to.

---

##### `existingQueueObj`<sup>Optional</sup> <a name="existingQueueObj" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.existingQueueObj"></a>

```typescript
public readonly existingQueueObj: Queue;
```

- *Type:* aws-cdk-lib.aws_sqs.Queue
- *Default:* None

Existing queue object to bind the event source to.

If not provided, a new queue will be created.
If an existing queue is provided, the queue will not be modified unless enableQueuePurging is set to true
or deployDeadLetterQueue is set to true

---

##### `maxReceiveCount`<sup>Optional</sup> <a name="maxReceiveCount" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.maxReceiveCount"></a>

```typescript
public readonly maxReceiveCount: number;
```

- *Type:* number
- *Default:* 3

Max receive count for the dead letter queue.

---

##### `messageGroupId`<sup>Optional</sup> <a name="messageGroupId" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.messageGroupId"></a>

```typescript
public readonly messageGroupId: string;
```

- *Type:* string

The message group id to use for fifo queues.

---

##### `queueProps`<sup>Optional</sup> <a name="queueProps" id="cdk-eventbridge-to-sqs.EventbridgeToSqsProps.property.queueProps"></a>

```typescript
public readonly queueProps: QueueProps;
```

- *Type:* aws-cdk-lib.aws_sqs.QueueProps
- *Default:* None

Properties for the new queue that will be created, if no existing queue is provided.

---



