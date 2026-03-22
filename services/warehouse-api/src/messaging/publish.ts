import amqp from "amqplib";

let channel: amqp.Channel | null = null;

async function getChannel(): Promise<amqp.Channel> {
  if (channel) {
    return channel;
  }

  const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
  const connection = await amqp.connect(url);

  channel = await connection.createChannel();

  await channel.assertExchange("events", "fanout", {
    durable: false,
  });

  return channel;
}

export async function publishEvent(event: unknown): Promise<void> {
  const ch = await getChannel();

  ch.publish("events", "", Buffer.from(JSON.stringify(event)));

  console.log("Published event:", event);
}