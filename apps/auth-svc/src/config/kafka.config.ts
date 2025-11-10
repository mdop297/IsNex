// kafka.config.ts
import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: process.env.KAFKA_CLIENT_ID || 'auth-svc',
      brokers: (process.env.KAFKA_BROKERS || 'broker:29092').split(','),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
      connectionTimeout: 3000,
      requestTimeout: 25000,
    },
    consumer: {
      groupId: process.env.KAFKA_CONSUMER_GROUP || 'auth-service-consumer',
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      retry: {
        retries: 5,
      },
    },
    producer: {
      allowAutoTopicCreation: true,
      retry: {
        retries: 5,
      },
    },
  },
};
