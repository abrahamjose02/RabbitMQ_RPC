import { Channel } from "amqplib";
import config from "../config";
import { randomUUID } from "crypto";
import EventEmitter from "events";


export default class Producer{
    constructor(private channel: Channel,private replyQueueName: string,private eventEmitter: EventEmitter){}

    async produceMessages(data:any){
        if(!data){
            throw new Error('Data cannot be undefined or null');
        }
        const uuid = randomUUID()
        console.log('the corr id is ',uuid)
        console.log('sending data:',data)

        const bufferData = Buffer.from(JSON.stringify(data))
        this.channel.sendToQueue(config.rabbitMQ.queues.rpcQueue,bufferData,{
            replyTo:this.replyQueueName,
            correlationId:uuid,
            expiration:10,
            headers:{
                function:data.operation,
            },
        });

        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (data) => {
              const reply = JSON.parse(data.content.toString());
              resolve(reply);
            });
          });
    }
}