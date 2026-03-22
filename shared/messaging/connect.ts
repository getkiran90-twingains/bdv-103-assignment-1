import amqp from "amqplib";

let channel: amqp.Channel | undefined;

export async function getChannel(): Promise<amqp.Channel> {
  if (channel) {
    return channel;
  }

  const url = process.env.RABBITMQ_URL || "amqp://localhost:5672";
  const connection = await amqp.connect(url);

  channel = await connection.createChannel();

  await channel.assertExchange("events", "fanout", {
    durable: false,
  });

  return channel;
}