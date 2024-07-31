import { Channel, ConsumeMessage } from "amqplib";
import MessageHandler from "../messageHandler";

export default class Consumer {
  constructor(private channel: Channel, private rpcQueue: string) {}

  async consumeMessages() {
    console.log("Ready to consume messages...");

    this.channel.consume(
      this.rpcQueue,
      async (message: ConsumeMessage | null) => {
        if (!message) {
          console.log("Received null message");
          return;
        }
        const { correlationId, replyTo, headers } = message.properties;
        if (!correlationId || !replyTo) {
          console.log("Missing some properties...");
          return;
        }
        if (!headers) {
          console.log("Missing headers...");
          return;
        }
        const operation = headers.function;
        console.log("Consumed", JSON.parse(message.content.toString()));
        await MessageHandler.handle(
          operation,
          JSON.parse(message.content.toString()),
          correlationId,
          replyTo
        );
      },
      {
        noAck: true,
      }
    );
  }
}
