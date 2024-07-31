import express from 'express';
import RabbitMQClient from './RabbitMQ/client';


const server = express();
server.use(express.json());

server.post('/operate',async(req,res,next)=>{
    console.log(req.body);
    const response = await RabbitMQClient.produce(req.body);
  res.send({ response });
})

server.listen(3001,()=>{
    console.log('Server Running...')
    RabbitMQClient.initialize();
})