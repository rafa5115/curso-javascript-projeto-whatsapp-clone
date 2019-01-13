import { Model } from "./Model";
import { Firebase } from '../util/Firebase';

export class Chat extends Model {
    constructor() {
        super();
    }

    get users() { return this._data.users; }
    set users(value) { this._data.users = value; }

    get timeStamp() { return this._data.timeStamp; }
    set timeStamp(value) { this._data.timeStamp = value; }

    static getRef() {
        return Firebase.db().collection('/chats');
    }


    static create(fromEmail, toEmail) {
        return new Promise((s, f) => {
            
            let users = {};
            users[btoa(fromEmail)] = true;
            users[btoa(toEmail)] = true;

            Chat.getRef().add({
                users,
                timeStamp: new Date()
            }).then(doc => {
                Chat.getRef().doc(doc.id).get().then(chat => {
                    s(chat);
                }).catch(error => {
                    f(error);
                });
            }).catch(error => {
                f(error);
            });
        });
    }

    static find(fromEmail, toEmail) {
        return Chat.getRef()
            .where(btoa(fromEmail), '==', true)
            .where(btoa(toEmail), '==', true)
            .get();
    }

    static createIfNotExists(fromEmail, toEmail) {
        return new Promise((s, f) => {
            Chat.find(fromEmail, toEmail).then(chats => {
                if (chats.empty) {
                    Chat.create(fromEmail, toEmail).then(chat => {
                        s(chat);
                    })
                } else {
                    chats.forEach(chat => {
                        s(chat);
                    })
                }
            }).catch(error => {
                f(error);
            })

        })
    }

}