import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SocketService {

  // This provider will be injectable and emit data based on certain events.
  // In the constructor method a websocket connection to the Golang application is established and three event listeners are created.
  // One event listener for each socket creation and destruction as well as a listener for when messages come in.

  private socket: WebSocket;
  private listener: EventEmitter<any> = new EventEmitter();

  public constructor() {
      this.socket = new WebSocket("ws://localhost:8080/ws");
      this.socket.onopen = event => {
          this.listener.emit({"type": "open", "data": event});
      }
      this.socket.onclose = event => {
          this.listener.emit({"type": "close", "data": event});
      }
      this.socket.onmessage = event => {
          this.listener.emit({"type": "message", "data": JSON.parse(event.data)});
      }
  }

  // The send method will allow us to send messages to the Golang application
  public send(data: string, userId: any) {
      this.socket.send(data + " " + userId);
  }

  // The close method will allow us to tell the Golang application that we are no longer connected.
  public close() {
      this.socket.close();
  }

  public getEventListener() {
      return this.listener;
  }

}
