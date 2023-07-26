import { Stack } from 'aws-cdk-lib';
import { EventBus, EventBusProps, EventPattern, IEventBus, Rule, RuleProps } from 'aws-cdk-lib/aws-events';
import { SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { DeadLetterQueue, Queue, QueueProps } from 'aws-cdk-lib/aws-sqs';
import { paramCase } from 'change-case';
import { Construct } from 'constructs';

export interface EventbridgeToSqsProps {
  readonly existingEventBusInterface?: IEventBus;
  readonly eventBusProps?: EventBusProps;
  readonly eventRuleProps?: RuleProps;
  readonly existingQueueObj?: Queue;
  readonly queueProps?: QueueProps;
  readonly enableQueuePurging?: boolean;
  readonly deployDeadLetterQueue?: boolean;
  readonly deadLetterQueueProps?: QueueProps;
  readonly maxReceiveCount?: number;
  readonly eventRuleFilterPattern?: EventPattern;
  readonly messageGroupId?: string;
};

export class EventbridgeToSqs extends Construct {
  eventBus: IEventBus;
  queue: Queue;
  deadLetterQueue?: DeadLetterQueue;
  rule: Rule;
  constructor(scope: Construct, id: string, props: EventbridgeToSqsProps) {
    super(scope, id);
    const {
      existingEventBusInterface,
      eventBusProps,
      queueProps,
      existingQueueObj,
      deployDeadLetterQueue,
      deadLetterQueueProps,
      messageGroupId,
      eventRuleProps,
      eventRuleFilterPattern,
      enableQueuePurging,
    } =
			props;

    if (existingEventBusInterface && eventBusProps) {
      throw new Error('You cannot provide both an existing event bus and event bus props');
    }

    if (!(existingEventBusInterface || eventBusProps)) {
      throw new Error('You must provide either an existing event bus or event bus props');
    }

    const eventBus = existingEventBusInterface || new EventBus(this, 'Bus', eventBusProps);
    // Event bus setup
    const normalizedId = paramCase(id);
    // Queue and DLQ setup

    if (existingQueueObj && queueProps) {
      throw new Error('You cannot provide both an existing queue and queue props');
    }
    if (!(existingQueueObj || queueProps)) {
      throw new Error('You must provide either an existing queue or queue props');
    }

    let queue: Queue = existingQueueObj || new Queue(this, 'Queue', {
      queueName: `${normalizedId}Queue${queueProps?.fifo ? '.fifo' : ''}`,
      ...queueProps,
      deadLetterQueue: deployDeadLetterQueue ? {
        queue: new Queue(this, 'DeadLetterQueue', {
          queueName: `${normalizedId}DeadLetterQueue${queueProps?.fifo ? '.fifo' : ''}`,
          ...deadLetterQueueProps,
        }),
        maxReceiveCount: props.maxReceiveCount || 3,
      }: undefined,
    });

    const rule = new Rule(this, 'BusToIngressQueue', eventRuleProps || {
      ruleName: `${normalizedId}-bus-to-ingress-queue`,
      eventBus,
      targets: [
        new SqsQueue(queue, {
          messageGroupId: messageGroupId,
        }),
      ],
      eventPattern: eventRuleFilterPattern || {
        region: [Stack.of(this).region],
      },
    });


    // Enable queue purging permissions for the event rule, if enabled
    if (enableQueuePurging) {
      queue.grantPurge(new ServicePrincipal('events.amazonaws.com'));
    }

    this.rule = rule;
    this.eventBus = eventBus;
    this.queue = queue;
    this.deadLetterQueue = queue.deadLetterQueue;
  }
}
