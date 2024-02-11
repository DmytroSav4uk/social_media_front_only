import {Component, ElementRef, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LivechatService} from "../../services/livechat/livechat.service";
import {catchError, Observable, tap, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ChatService} from "../../services/chat/chat.service";
import {photoUrl, webSocket} from "../../configs/urls";


@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.css']
})
export class PrivateChatComponent implements OnInit {


  @ViewChild('audioPlayer') audioPlayer!: ElementRef;


  @ViewChild('chatThread', {static: false}) chatThread!: ElementRef;

  constructor(private router: Router, private chatService: ChatService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private formBuilder: FormBuilder, private webSocketService: LivechatService) {
    this.messageForm = new FormGroup({})
    this.messages = [];

  }

  isRecording = false;
  mediaRecorder!: MediaRecorder;
  chunks: Blob[] = [];


  messageForm: FormGroup = new FormGroup({})
  messages: any[];

  token!: string;
  userEmail!: string;

  imageUrl = photoUrl;

  chatId: any;

  webSocketUrl = webSocket;

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id');
    });

    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
    this.getMessages();

    const currentUser = localStorage.getItem('currentUser');
    const token = currentUser ? (JSON.parse(currentUser)?.access_token || null) : null;
    const email = currentUser ? (JSON.parse(currentUser)?.email || null) : null;
    this.token = token;
    this.userEmail = email;
    this.webSocketService.connect(`${this.webSocketUrl}/livechat/socket?token=${this.token}&room=${this.chatId}`);
    this.webSocketService.onMessage()
      .pipe(
        tap((data) => {
          if (!data.type) {
            this.messages.push(data);
          } else if (data.type === 'message_deleted') {
            const messageIdToRemove = data.message_id;
            const indexToRemove = this.messages.findIndex(message => message.id === messageIdToRemove);
            if (indexToRemove !== -1) {
              this.messages.splice(indexToRemove, 1);
            }
          } else if (data.type === 'message_edited') {
            const messageIdToEdit = data.message_id;
            const newContent = data.new_content;

            const messageIndex = this.messages.findIndex(message => message.id === messageIdToEdit);

            if (messageIndex !== -1) {
              this.messages[messageIndex].message = newContent;
            } else {

              console.error('Message not found:', messageIdToEdit);
            }
          } else if (data.type === 'imageUpload') {
            this.messages.push(data);
          }

        }),
        catchError((error) => {
          console.error('Error:', error);
          return throwError(error);
        })
      )
      .subscribe();

    setTimeout(() => {
      this.scrollToBottom();
    }, 1000)

  }

  processMessage(message: string): any {
    if (message) {
      const processedMessage = message.replace(/\\n/g, '<br>');
      const sanitizedMessage = this.sanitizer.sanitize(SecurityContext.HTML, processedMessage);
      return sanitizedMessage !== null ? sanitizedMessage : '';
    }
    return
  }

  // ngOnDestroy() {
  //   this.webSocketService.disconnect()
  // }


  getMessages() {
    this.chatService.viewRoom(this.chatId)
      .pipe(
        tap((response: any) => {
          this.messages = response.messages
        }),
        catchError((error: any): Observable<any> => {
          throw error;
        })
      )
      .subscribe();
  }

  submitMessageForm() {
    if (!this.editingMessage) {
      this.webSocketService.sendMessage(this.messageForm.value.message)
      this.messageForm.reset()
      setTimeout(() => {
        this.scrollToBottom()
      }, 300)
    } else {
      this.chatService.editMessage(this.editMessageId, this.messageForm.value).pipe(
        tap((response: any) => {
          this.editMessageId = null
          this.editingMessage = false
          this.contextMessage = null
          this.messageForm.reset()
        }),
        catchError((error: any): Observable<any> => {
          throw error;
        })
      )
        .subscribe();
    }
  }

  scrollToBottom(): void {
    try {
      this.chatThread.nativeElement.scrollTop = this.chatThread.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submitMessageForm();
    }
  }


  contextMenuVisible = false;

  contextMenuId: any;
  contextMenuPosition = {top: 0, left: 0};


  lastMessageUserEmail: string | null = null;
  showAvatarOnCurrentMessage: boolean = false;

  showAvatar(message: any, currentIndex: number, isLast: boolean): boolean {
    if (isLast) {
      this.lastMessageUserEmail = message.user.email;
      return message.user.email !== this.userEmail;
    }

    const nextMessage = this.messages[currentIndex + 1];
    this.showAvatarOnCurrentMessage = nextMessage && nextMessage.user.email === this.userEmail;

    return this.showAvatarOnCurrentMessage;
  }


  //была бага со временем, если Ростик сломает у себя, оно починится у меня
  reformatDate(timestamp: string | { hour: number, minute: number }): string {
    let hours: number;
    let minutes: number;
    if (typeof timestamp === 'string') {
      const dateTime = new Date(timestamp);
      hours = dateTime.getHours();
      minutes = dateTime.getMinutes();
    } else if (typeof timestamp === 'object' && timestamp !== null && 'hour' in timestamp && 'minute' in timestamp) {
      hours = timestamp.hour;
      minutes = timestamp.minute;
    } else {
      throw new Error('Invalid timestamp format');
    }

    const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

    return formattedTime;
  }


  contextMessage: any;
  editMessageId: any;
  editingMessage!: boolean;

  showContextMenu(event: MouseEvent, message: any): void {
    this.contextMessage = message
    if (message?.user?.email === this.userEmail) {
      event.preventDefault();
      this.contextMenuId = message.id
      this.contextMenuVisible = true;
      this.contextMenuPosition = {top: event.clientY - 50, left: event.clientX - 50};


      const closeContextMenu = () => {
        this.contextMenuVisible = false;
        // this.contextMenuId = null
        document.removeEventListener('click', closeContextMenu);
      };
      document.addEventListener('click', closeContextMenu);
    }
  }

  deleteMessage(): void {
    this.chatService.deleteForAll(this.contextMenuId)
      .pipe(
        tap((response: any) => {
        }),
        catchError((error: any): Observable<any> => {
          throw error;
        })
      )
      .subscribe();
    this.contextMenuVisible = false;
  }

  startEditMessage() {
    this.messageForm.patchValue({message: this.contextMessage.message});
    this.editMessageId = this.contextMessage.id;
    this.editingMessage = true;
  }

  cancelEdit() {
    this.editMessageId = null
    this.editingMessage = false
    this.contextMessage = null
    this.messageForm.reset()
  }

  visitProfile(id: number) {
    this.router.navigateByUrl('visit/' + id)
  }


  selectedImage!: File;

  onFileSelected(event: any) {
    this.selectedImage = <File>event.target.files[0];
    this.uploadImage()
  }


  uploadImage() {

    const fd = new FormData();
    fd.append('file', this.selectedImage, this.selectedImage.name)

    this.chatService.photoUpload(this.chatId, fd)
      .pipe(
        tap((response: any) => {
        }),
        catchError((error: any): Observable<any> => {
          throw error;
        })
      )
      .subscribe();
  }


  startRecording() {
    this.chunks = [];
    navigator.mediaDevices.getUserMedia({audio: true})
      .then((stream) => {
        this.isRecording = true;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.showAudioMenu = true
        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0) {
            this.chunks.push(event.data);
          }
        });

        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.chunks, {type: 'audio/webm'});
          const audioUrl = URL.createObjectURL(audioBlob);
          this.audioPlayer.nativeElement.src = audioUrl;
        });
      })
      .catch((error) => {
        console.error('Error accessing the microphone:', error);
      });
  }

  stopRecording() {
    this.isRecording = false;
    this.mediaRecorder.stop();
  }


  showAudioMenu: boolean = false;

  sendAudio() {
    const audioBlob = new Blob(this.chunks, {type: 'audio/mp3'});
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.mp3');

    this.chatService.audioUpload(this.chatId, formData)
      .pipe(
        tap((response: any) => {
          this.showAudioMenu = false
        }),
        catchError((error: any): Observable<any> => {
          throw error;
        })
      )
      .subscribe();
  }


  cancelAudio() {
    this.showAudioMenu = false
  }
}
