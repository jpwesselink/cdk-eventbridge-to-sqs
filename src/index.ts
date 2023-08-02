/**
 * @packageDocumentation
 *
 * This package contains a CDK construct which allows you to forward events from an Eventbridge bus to an SQS queue.
 *
 * If no existing queue is provided, a new queue will be created.
 * If you provide queueProps, the queue will be created with those props, except for its name,
 * which will be auto-generated, based on the construct Id. The same applies to the dead letter queue.
 *
 * If no existing event bus is provided, a new event bus will be created.
 *
 */

import { Stack } from 'aws-cdk-lib';
import {
  EventBus,
  EventBusProps,
  EventPattern,
  IEventBus,
  Rule,
  RuleProps,
} from 'aws-cdk-lib/aws-events';
import { SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { DeadLetterQueue, Queue, QueueProps } from 'aws-cdk-lib/aws-sqs';
import { paramCase } from 'change-case';
import { Construct } from 'constructs';

/**
 * The properties for the EventbridgeToSqs class.
 */
export interface EventbridgeToSqsProps {
  /**
	 * An existing event bus to bind the rule to
	 * @default - A new event bus will be created
	 */
  readonly existingEventBusInterface?: EventBus;

  /**
	 * Properties for the new event bus that will be created
	 * @default - None
	 */
  readonly eventBusProps?: EventBusProps;

  /**
	 * Properties for the new event rule that will be created
	 * @default - None
	 */
  readonly eventRuleProps?: RuleProps;

  /**
	 * Existing queue object to bind the event source to. If not provided, a new queue will be created.
	 * If an existing queue is provided, the queue will not be modified unless enableQueuePurging is set to true
	 * or deployDeadLetterQueue is set to true
	 * @default - None
	 */
  readonly existingQueueObj?: Queue;

  /**
	 * Properties for the new queue that will be created, if no existing queue is provided
	 * @default - None
	 *
	 */
  readonly queueProps?: QueueProps;

  /**
	 * The message group id to use for fifo queues
	 */
  readonly messageGroupId?: string;

  /**
	 * Whether to enable queue purging. If true, the queue will be purged before deployment
	 * @default - false
	 */
  readonly enableQueuePurging?: boolean;

  /**
	 * Whether to deploy a dead letter queue for the main queue
	 * @default - false
	 */
  readonly deployDeadLetterQueue?: boolean;

  /**
	 * Properties for the dead letter queue, if deployDeadLetterQueue is true
	 * @default - None
	 */
  readonly deadLetterQueueProps?: QueueProps;

  /**
	 * Max receive count for the dead letter queue
	 * @default - 3
	 */
  readonly maxReceiveCount?: number;

  /**
	 * Event pattern to use for the event rule
	 * Defaults to an event pattern that matches all events in the same region as the event bus
	 * @default - None
	 */
  readonly eventRuleFilterPattern?: EventPattern;
}

/**
 *
 * @param scope - the scope in which to deploy the construct
 * @param id - the id of the construct
 * @param props - the EventbridgeToSqsProps
 */
export class EventbridgeToSqs extends Construct {
  eventBus: IEventBus;
  queue: Queue;
  deadLetterQueue?: DeadLetterQueue;
  rule: Rule;
  constructor(scope: Construct, id: string, props?: EventbridgeToSqsProps) {
    super(scope, id);
    const {
      existingEventBusInterface,
      eventBusProps,
      queueProps,
      existingQueueObj,
      deployDeadLetterQueue,
      deadLetterQueueProps,
      eventRuleProps,
      eventRuleFilterPattern,
      enableQueuePurging,
      maxReceiveCount,
      messageGroupId,
    } = props || {};

    // normalize Id for use in resource names
    const normalizedId = paramCase(id);

    // if both existing and new event bus are provided, throw an error
    if (existingEventBusInterface && eventBusProps) {
      throw new Error(
        'You cannot provide both an existing event bus and event bus props',
      );
    }

    // use existing event bus or create a new one
    const eventBus =
			existingEventBusInterface ||
			new EventBus(
			  this,
			  'Bus',
			  eventBusProps || {
			    eventBusName: `${normalizedId}-event-bus`,
			  },
			);

    // if both existing and new queue are provided, throw an error
    if (existingQueueObj && queueProps) {
      throw new Error(
        'You cannot provide both an existing queue and queue props',
      );
    }

    // if an existing queue is provided, create a new queue
    const queue: Queue =
			existingQueueObj ||
			new Queue(this, 'Queue', {
			  queueName: `${normalizedId}-queue${queueProps?.fifo ? '.fifo' : ''}`,
			  ...queueProps,

			  deadLetterQueue:
					// if dead letter queue is enabled, create a new dead letter queue
					deployDeadLetterQueue
					  ? {
					    queue: new Queue(this, 'DeadLetterQueue', {
					      queueName: `${normalizedId}-dead-letter-queue${
					        deadLetterQueueProps?.fifo ? '.fifo' : ''
					      }`,
					      ...deadLetterQueueProps,
					    }),
					    maxReceiveCount: maxReceiveCount || 3,
						  }
					  : undefined,
			});

    // event rule setup
    const rule = new Rule(
      this,
      'BusToIngressQueue',
      // if event rule props are provided, use them
      eventRuleProps || {
        ruleName: `${normalizedId}-bus-to-ingress-queue`,
        eventBus,
        targets: [
          new SqsQueue(
            queue,
            // if sqs queue props are provided, use them
            {
              messageGroupId:
								messageGroupId || queue?.fifo ? queue.queueName : undefined,
            },
          ),
        ],
        eventPattern: eventRuleFilterPattern || {
          region: [Stack.of(this).region],
        },
      },
    );

    // Enable queue purging permissions for the event rule, if enabled
    if (enableQueuePurging) {
      queue.grantPurge(new ServicePrincipal('events.amazonaws.com'));
    }

    // Expose resources for referencing
    this.rule = rule;
    this.eventBus = eventBus;
    this.queue = queue;
    this.deadLetterQueue = queue.deadLetterQueue;
  }
}
