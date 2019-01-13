import { Firebase } from './../util/Firebase';
import { Model } from './Model';

export class User extends Model {

    constructor(id) {
        super();

        if (id) {
            this.getById(id).then(doc => {
                this.updateContactsCount();
            });
        } 
    }

    get name() { return this._data.name; }
    set name(value) { this._data.name = value; }

    get email() { return this._data.email; }
    set email(value) { this._data.email = value; }

    get photo() { return this._data.photo; }
    set photo(value) { this._data.photo = value; }

    get chatId() { return this._data.chatId; }
    set chatId(value) { this._data.chatId = value; }

    get contactsCount() { return this._data.contactsCount; }
    set contactsCount(value) { this._data.contactsCount = value; }

    updateContactsCount() {
        if (this.email) {
            User.getContactsRef(this.email).onSnapshot(docs => {
                this.contactsCount = docs.size;
            });
        } else {
            this.contactsCount = 0;
        }
    }

    getById(id) {
        return new Promise((s, f) => {

            User.findByEmail(id).onSnapshot(doc => {
                this.fromJSON(doc.data());
                s(doc);
            });
        });
    }

    save() {
        let result = User.findByEmail(this.email).set(this.toJSON());
        this.updateContactsCount();
        return result;
    }

    addContact(contact) {
        return User.getContactsRef(this.email).doc(btoa(contact.email)).set(contact.toJSON());
    }

    getContacts(filter = '') {
        
        return new Promise((s, f) => {
            let contacts = [];
            User.getContactsRef(this.email).where('name', '>=', filter).onSnapshot(docs => {
                docs.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    contacts.push(data);
                })

                this.trigger('contactschange', docs);
                s(contacts);
            });
        });

    }

    static getRef() {
        return Firebase.db().collection('/users');
    }

    static getContactsRef(id) {
        return User.getRef().doc(id).collection('contacts');
    }

    static findByEmail(email) {
        return User.getRef().doc(email);
    }
}
    