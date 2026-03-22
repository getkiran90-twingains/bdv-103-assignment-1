import amqp from "amqplib";
import { upsertOrdersBookCache } from "../orders/bookCache";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function startOrdersSubscriber(): Promise<void> {
  const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  while (true) {
    try {
      const connection = await amqp.connect(url);
      const channel = await connection.createChannel();

      await channel.assertExchange("events", "fanout", {
        durable: false,
      });

      const q = await channel.assertQueue("", {
        exclusive: true,
      });

      await channel.bindQueue(q.queue, "events", "");

      console.log("Orders subscriber waiting for events...");

      channel.consume(q.queue, async (msg) => {
        if (!msg) return;

        const event = JSON.parse(msg.content.toString());

        console.log("Orders received event:", event);

        if (event.type === "BookAdded") {
          await upsertOrdersBookCache({
            bookId: event.bookId,
            name: event.name,
          });

          console.log("Orders cached valid book:", event.bookId, event.name);
        }

        channel.ack(msg);
      });

      break;
    } catch (error) {
      console.error("Orders subscriber connection failed. Retrying in 5 seconds...", error);
      await sleep(5000);
    }
  }
}