export class Message 
{
    id: string | undefined;

    content: string | undefined;

    sendUserId: string | undefined;

    receiveUserId: string | undefined;

    sendUserName: string | undefined;

    receiveUserName: string | undefined;

    timeSend: Date = new Date();

    success: boolean = true;

    constructor() {
        this.id = new Date().toString() + Math.floor(Math.random() * (Math.random() * 1000));
    }
}