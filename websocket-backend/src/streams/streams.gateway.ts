import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  WsResponse
 } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Server } from 'ws'

@WebSocketGateway({transports: ["websocket"]})
export class StreamsGateway
 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect { 
   @WebSocketServer() server: Server;
  private logger: Logger = new Logger('StreamsGateway'); 
  private counter = 0

  public afterInit(server: Server): void {
    return this.logger.log("Initialized Websocket gateway")
  }

  public handleDisconnect(@ConnectedSocket() client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`)
  }

  public handleConnection(@ConnectedSocket() client: Socket): void {
    client.id = this.counter++
    return this.logger.log(`Client connected: ${client.id}`)
  }
  
  @SubscribeMessage('message')
  handleMessage(
    client: Socket,
    text: string): void {
      this.server.emit('message', text)
      console.log(`Message from client: ${text}`)
      //return { event: 'message', data: text}
  } 
  
  
}