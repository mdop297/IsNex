from confluent_kafka import Producer
from confluent_kafka.schema_registry import SchemaRegistryClient
from confluent_kafka.schema_registry.protobuf import ProtobufSerializer
from user_pb2 import User  # Import your generated Protobuf class

# Schema Registry configuration
schema_registry_conf = {
    "url": "http://localhost:8081"
}  # Replace with your Schema Registry URL
schema_registry_client = SchemaRegistryClient(schema_registry_conf)

# Kafka Producer configuration
producer_conf = {
    "bootstrap.servers": "localhost:9092"
}  # Replace with your Kafka brokers
producer = Producer(producer_conf)

# Protobuf Serializer
# The 'User' class is passed to the serializer so it can extract the schema
protobuf_serializer = ProtobufSerializer(User, schema_registry_client)

topic = "my_protobuf_topic"

# Create a Protobuf message
user_message = User(id=1, name="Alice", email="alice@example.com")

# Serialize and produce the message
try:
    serialized_message = protobuf_serializer(user_message, topic)
    producer.produce(topic, value=serialized_message)
    producer.flush()
    print(f"Produced message: {user_message}")
except Exception as e:
    print(f"Error producing message: {e}")
