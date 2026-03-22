import amqp from "amqplib";
import { upsertWarehouseBookCache } from "../warehouse/bookCache";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function startWarehouseSubscriber(): Promise<void> {
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

      console.log("Warehouse subscriber waiting for events...");

      channel.consume(q.queue, async (msg) => {
        if (!msg) return;

        const event = JSON.parse(msg.content.toString());

        console.log("Warehouse received event:", event);

        if (event.type === "BookAdded") {
          await upsertWarehouseBookCache({
            bookId: event.bookId,
            name: event.name,
          });

          console.log("Warehouse cached book:", event.bookId, event.name);
        }

        channel.ack(msg);
      });

      break;
    } catch (error) {
      console.error("Warehouse subscriber connection failed. Retrying in 5 seconds...", error);
      await sleep(5000);
    }
  }
}