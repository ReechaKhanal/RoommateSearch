import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from "../socket.service";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  /** Chat Logic for our application */
  messages: Array<any>;
  chatBox: string;

  userSentName: string | undefined;
  userSentId: any;

  // In the constructor method we inject our provider and intialize our public variables that are bound to the UI
  constructor(private socket: SocketService, private route: ActivatedRoute, private router: Router ) {
    this.messages = [];
    this.chatBox = "";
  }

  // Since it is not a good idea to load or subscribe to events within the constructor method so instead we use the ngOnInit method.
  ngOnInit() {

    // Here, we are subscribing to the event listener we had created in the provider class.
    // We check to see what kind of event we found.
    // If the event is a message then we check to see if there was a sender and prepend it to the message.
    this.socket.getEventListener().subscribe((event: { type: string; data: { content: any; sender: string; }; }) => {
        if(event.type == "message") {
            let data = event.data.content;
            if(event.data.sender) {
                data = event.data.sender + ": " + data;
            }
            this.messages.push(data);
        }

        // The messages starting with a slash represent sytem messages. We will later bold these system messages.
        if(event.type == "close") {
            this.messages.push("/The socket connection has been closed");
        }
        if(event.type == "open") {
            this.messages.push("/The socket connection has been established");
        }
    });

    this.route.queryParams.subscribe(params => {

      this.userSentName = params.userName;
      this.userSentId = params.userId;
      console.log(this.userSentId, this.userSentName);
    });
  }

  //Upon destruction, the close event is sent to the server and if the chatbox is sent, the message is sent to the server.
  ngOnDestroy(): void {
    this.socket.close();
  }

  send() {
    if(this.chatBox) {
        this.socket.send(this.chatBox);
        this.chatBox = "";
    }
  }

  isSystemMessage(message: string) {
    return message.startsWith("/") ? "<strong>" + message.substring(1) + "</strong>" : message;
  }

}
