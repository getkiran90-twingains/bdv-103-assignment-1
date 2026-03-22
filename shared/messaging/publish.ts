import { getChannel } from "./connect";

export async function publishEvent(event: unknown): Promise<void> {
  const channel = await getChannel();

  channel.publish(
    "events",
    "",
    Buffer.from(JSON.stringify(event))
  );

  console.log("Published event:", event);
}