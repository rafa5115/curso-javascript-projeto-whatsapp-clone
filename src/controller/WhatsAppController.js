
import { Format } from './../util/Format';
import { Firebase } from './../util/Firebase';
import { Base64 } from "../util/Base64";
import { Upload } from "../util/Upload";

import { User } from '../model/User';
import { Chat } from '../model/Chat';
import { Message } from '../model/Message';

import { CameraController } from './CameraController';
import { MicrophoneController } from './MicrophoneController';
import { DocumentPreviewController } from './DocumentPreviewController';
import { ContactsController } from './ContactsController';

export class WhatsAppController{

    constructor() {

        this._firebase = new Firebase();

        this.initAuth()
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();

    }

    initAuth() {
        this._firebase.initAuth().then(response => {
            this._user = new User(response.user.email);

            this._user.on('datachange', data => {
                this.el.inputNamePanelEditProfile.innerHTML = data.name;
                document.querySelector('title').innerHTML = data.name + ' - WhatsApp Clone';
                if (data.photo) {
                    this.el.imgPanelEditProfile.src = data.photo;
                    this.el.imgPanelEditProfile.show();
                    this.el.imgDefaultPanelEditProfile.hide();

                    let myPhoto = this.el.myPhoto.querySelector('img');
                    myPhoto.src = data.photo;
                    myPhoto.show();

                }
                if (this._user.email) {
                    this.initContacts();
                }
            });

            this._user.getById(response.user.email).then(doc => {
                
                if (doc.exists) {
                    this.el.appContent.css({
                        display: 'flex'
                    });
                } else {
                    this._user.email = response.user.email;
                    this._user.name = response.user.displayName;
                    this._user.photo = response.user.photoURL;
                    this._user.save().then(()=>{
                        this.el.appContent.css({
                            display: 'flex'
                        });
                    }).catch(error => {
                        console.error('Erro ao salvar', error);
                    });
                }
            }).catch(error => {
                console.error('Erro ao buscar', error);
            });

        }).catch(error=>{
            console.error(error);
        });

    }


    initContacts() {
        this._user.on('contactschange', docs => {
            this.el.contactsMessagesList.innerHTML = '';
            docs.forEach(doc => {
                this.el.contactsMessagesList.appendChild(this.getContactEl(doc.data()));
            })
        });
        this._user.getContacts();
    }

    getContactEl(contact) {

        let contactEl = document.createElement('div');
        contactEl.className = 'contact-item';
        contactEl.dataset.email = contact.email;
        contactEl.innerHTML = `
            <div class="dIyEr">
                <div class="_1WliW" style="height: 49px; width: 49px;">
                    <img src="#" class="Qgzj8 gqwaM photo" style="display:block;">
                    <div class="_3ZW2E">
                        <span data-icon="default-user" class="">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                                <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                                <g fill="#FFF">
                                    <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                                </g>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            <div class="_3j7s9">
                <div class="_2FBdJ">
                    <div class="_25Ooe">
                        <span dir="auto" title="Nome do Contato" class="_1wjpf">${contact.name}</span>
                    </div>
                    <div class="_3Bxar">
                        <span class="_3T2VG">${Format.timeStampToTime(contact.lastMessageTime)}</span>
                    </div>
                </div>
                <div class="_1AwDx">
                    <div class="_itDl">
                        <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>

                        <span class="_2_LEW last-message">
                            <div class="_1VfKB">
                                <span data-icon="status-dblcheck" class="">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
                                        <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                                    </svg>
                                </span>
                            </div>
                            <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
                            <div class="_3Bxar">
                                <span>
                                    <div class="_15G96">
                                        <span class="OUeyt messages-count-new" style="display:none;">1</span>
                                    </div>
                            </div>
                            </span>
                    </div>
                </div>
            </div>
        `;

        if (contact.photo) {
            contactEl.querySelector('img').src = contact.photo;
        }
        contactEl.on('click', e => {
            this.setActiveChat(contact);
        })
        return contactEl;
    }


    elementsPrototype() {

        Element.prototype.hide = function() {
            this.style.display = 'none';
            return this;
        };

        Element.prototype.show = function() {
            this.style.display = 'block';
            return this;
        };

        Element.prototype.toggle = function() {
            this.style.display = (this.style.display === 'none') ? 'block' : 'none';
            return this;
        };
       
        Element.prototype.on = function(events, fn) {
            events.split(' ').forEach(event => {
                this.addEventListener(event, fn);
            });
            return this;
        };

        Element.prototype.css = function(styles) {
            for (let name in styles) {
                this.style[name] = styles[name];
            }
            return this;
        };

        Element.prototype.addClass = function(name) {
            this.classList.add(name);
            return this;
        };

        Element.prototype.removeClass = function(name) {
            this.classList.remove(name);
            return this;
        };

        Element.prototype.toggleClass = function(name) {
            this.classList.toggle(name);
            return this;
        };

        Element.prototype.hasClass = function(name) {
            return this.classList.contains(name);
        };

        HTMLFormElement.prototype.getForm = function() {
            return new FormData(this);
        };

        HTMLFormElement.prototype.toJSON = function() {
            let json = {};
            this.getForm().forEach((value, key) => {
                json[key] = value;
            })
            return json;
        };

        File.prototype.simpleType = function() {
            let simpleType;
            if (this.type.indexOf('/') == -1) {
                simpleType = this.type;
            } else {
                simpleType = this.type.substring(0, this.type.indexOf('/'));
                if (simpleType == 'application') simpleType = this.type.substring(this.type.indexOf('/')+1);
            }
            return simpleType;
        }


    }

    loadElements() {
        this.el = {};
        document.querySelectorAll('[id]').forEach(element => {
            this.el[Format.getCamelCase(element.id)] = element;
        })
    }

    setActiveChat(contact) {

        if (this._contatActive) {
            Message.getRef(this._contatActive.chatId).onSnapshot(() => {});
        }

        this._contatActive = contact;

        this.el.activeName.innerHTML = contact.name;
        this.el.activeStatus.innerHTML = contact.activeStatus;

        if (contact.photo) {
            this.el.activePhoto.src = contact.photo;
            this.el.activePhoto.show();
        }

        this.el.home.hide();
        this.el.main.css({
            display: 'flex'
        });

        this.el.panelMessagesContainer.innerHTML = '';

        Message.getRef(this._contatActive.chatId).orderBy('timeStamp').onSnapshot(docs => {

            let scrollTop = this.el.panelMessagesContainer.scrollTop;
            let scrollTopMax = (this.el.panelMessagesContainer.scrollHeight - this.el.panelMessagesContainer.offsetHeight);
            
            docs.forEach(doc => {

                let msgEl = this.el.panelMessagesContainer.querySelector('#_' + doc.id);

                let message = new Message();

                let data = doc.data();
                let me = (data.from == this._user.email);
                data.id = doc.id;
                message.fromJSON(data);

                let view = message.getViewElement(me);
                
                if (!msgEl) {

                    if (!me) {
                        doc.ref.set({
                            status: 'read'
                        }, {
                            merge: true
                        });
                    }

                    this.el.panelMessagesContainer.appendChild(view);

                } else {
                    msgEl.parentNode.replaceChild(view, msgEl);
                    if (me) {
                        msgEl.querySelector('.message-status').innerHTML = message.getStatusViewElement().outerHTML;
                    }
                }

                if (message.type == 'contact') {

                    view.querySelector('.btn-message-send').on('click', e => {

                        Chat.createIfNotExists(this._user.email, message.content.email).then(chat => {

                            let contact = new User(message.content.email);

                            contact.on('datachange', data => {
                                contact.chatId = chat.id;
                                this._user.addContact(contact);
                                this._user.chatId = chat.id;
                                contact.addContact(this._user);
        
                                this.setActiveChat(contact);
                            })

                        });
    
                    });
                }
           
            });

            if (scrollTop >= (scrollTopMax -1)) {
                this.el.panelMessagesContainer.scrollTop
                = (this.el.panelMessagesContainer.scrollHeight
                - this.el.panelMessagesContainer.offsetHeight); 
            } else {
                this.el.panelMessagesContainer.scrollTop = scrollTop;
            }

        });

    }

    initEvents() {

        this.el.inputSearchContacts.on('keyup', e=> {
            if (this.el.inputSearchContacts.value.length > 0) {
                this.el.inputSearchContactsPlaceholder.hide();
            } else {
                this.el.inputSearchContactsPlaceholder.show();
            }

            this._user.getContacts(this.el.inputSearchContacts.value);
        })

        this.el.myPhoto.on('click', e=>{
            this.closeAllLeftPanels();
            this.el.panelEditProfile.show();
            setTimeout(()=>{
                this.el.panelEditProfile.addClass('open');
            }, 300);
        });

        this.el.btnNewContact.on('click', e=>{
            this.closeAllLeftPanels();
            this.el.panelAddContact.show();
            setTimeout(()=>{
                this.el.panelAddContact.addClass('open');
            }, 300);
        });

        this.el.btnClosePanelEditProfile.on('click', e=>{
            this.el.panelEditProfile.removeClass('open');
        });

        this.el.btnClosePanelAddContact.on('click', e=>{
            this.el.panelAddContact.removeClass('open');
        });

        this.el.photoContainerEditProfile.on('click', e=>{
            this.el.inputProfilePhoto.click();
        });

        this.el.inputProfilePhoto.on('change', e => {
            if (this.el.inputProfilePhoto.files.length > 0) {

                Upload.send(this.el.inputProfilePhoto.files[0], this._user.email).then( snapshot => {
                    snapshot.ref.getDownloadURL().then(downloadURL => {
                        this._user.photo = downloadURL;
                        this._user.save().then(()=>{
                            this.el.btnClosePanelEditProfile.click();
                        });
                    })                    
                })
            }
        })

        this.el.inputNamePanelEditProfile.on('keypress', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();
            }
        });

        this.el.btnSavePanelEditProfile.on('click', e => {
            e.preventDefault();
            this.el.btnSavePanelEditProfile.disabled = true;
            this._user.name = this.el.inputNamePanelEditProfile.innerHTML;
            this._user.save().then(()=>{
                this.el.btnSavePanelEditProfile.disabled = false;
                this.el.btnClosePanelEditProfile.click();
            });
        });

        this.el.formPanelAddContact.on('submit', e => {
            e.preventDefault();
            
            let formData = new FormData(this.el.formPanelAddContact);
            let contact = new User(formData.get('email'));

            contact.on('datachange', data => {

                if (data.name) {

                    Chat.createIfNotExists(this._user.email, contact.email).then(chat => {

                        contact.chatId = chat.id;
                        this._user.chatId = chat.id;

                        contact.addContact(this._user);

                        this._user.addContact(contact).then(() => {
                            this.el.btnClosePanelAddContact.click();
                        });
    
                    });

                } else {
                    console.error('Usuário não existe');
                }
            })
            this.el.panelAddContact.hide();
        });

        // já pode apagar esse bloco
        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(contact => {
            contact.on('click', e => {
                this.el.home.hide();
                this.el.main.css({
                    display: 'flex'
                });
                let user = new User(contact.dataset.email);
                console.log('this.el.contactsMessagesList.querySelectorAll');
                console.dir(this.el.activePhoto);
                console.log(user._data);
                //this.el.activePhoto.src = user.photo;
                this.el.activePhoto.show();
                this.el.activeName.innerHTML = user._data.name;

            });
        });


        // Inicialização dos eventos relacionados com o menu Atach

        this.el.btnAttach.on('click', e => {
            e.stopPropagation();
            this.el.menuAttach.addClass('open');
            document.addEventListener('click', this.closeMenuAttach.bind(this));

        });

        this.el.btnAttachPhoto.on('click', e => {
            this.el.inputPhoto.click();
        });

        this.el.inputPhoto.on('change', e => {
            [...this.el.inputPhoto.files].forEach(file => {
                Message.sendImage(this._contatActive.chatId, this._user.email, file);
            })
        })

        this.el.btnAttachCamera.on('click', e => {
            this.closeAllMainPanels();
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.css({
                height: 'calc(100% - 120px)'
            });
            this._camera = new CameraController(this.el.videoCamera);
        });

        this.el.btnTakePicture.on('click', e => {
            this.el.pictureCamera.src = this._camera.takePicture();
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();
            this.el.btnReshootPanelCamera.show();
            this.el.containerTakePicture.hide();
            this.el.containerSendPicture.show();
        });

        this.el.btnReshootPanelCamera.on('click', e => {
            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerTakePicture.show();
            this.el.containerSendPicture.hide();
        });

        this.el.btnSendPicture.on('click', e=> {

            this.el.btnSendPicture = true;

            let regex = /^data:(.+);base64,(.*)$/;
            let result = this.el.pictureCamera.src.match(regex);
            let type = result[1];
            let ext = type.split('/')[1];
            let filename = `camera${Date.now()}.${ext}`;

            let picture = new Image();
            picture.src = this.el.pictureCamera.src;

            picture.on('load', e => {

                let canvas = document.createElement('canvas');
                canvas.width = picture.width,
                canvas.height = picture.height

                let context = canvas.getContext('2d');
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
                context.drawImage(picture, 0, 0, canvas.width, canvas.height);

                fetch(canvas.toDataURL(type))
                    .then(res => { return res.arrayBuffer(); })
                    .then(buffer => { return new File([buffer], filename, { type }); })
                    .then(file => {

                        Message.sendImage(this._contatActive.chatId, this._user.email, file);

                        this.el.btnSendPicture = false;
                        this.closeAllMainPanels();
                        this._camera.stop();
                        this.el.btnReshootPanelCamera.hide();
                        this.el.pictureCamera.hide();
                        this.el.containerSendPicture.hide();
                        this.el.videoCamera.show();
                        this.el.containerTakePicture.show();
                        this.el.panelMessagesContainer.show();
                    });
            });
        });
        

        this.el.btnClosePanelCamera.on('click', e => {
            this._camera.stop();
            this.closeAllMainPanels();
            this.el.panelMessagesContainer.show();
        });


        this.el.btnAttachDocument.on('click', e => {
            this.closeAllMainPanels();
            this.el.panelDocumentPreview.addClass('open');
            this.el.panelDocumentPreview.css({
                height: 'calc(100% - 120px)'
            });

            this.el.inputDocument.click();

        });

        this.el.inputDocument.on('change', e=> {
            if (this.el.inputDocument.files.length) {
                this.el.panelDocumentPreview.css({
                    height: '1%'
                });
                let file = this.el.inputDocument.files[0];
                this._documentPreviewController = new DocumentPreviewController(file);
                this._documentPreviewController.getPreviewData().then(data=>{
                    this.el.imgPanelDocumentPreview.src = data.src;
                    this.el.infoPanelDocumentPreview.innerHTML = data.info;
                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();
                    this.el.panelDocumentPreview.css({
                        height: 'calc(100% - 120px)'
                    });
                }).catch(error => {
                    this.el.panelDocumentPreview.css({
                        height: 'calc(100% - 120px)'
                    });
                    this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.el.imagePanelDocumentPreview.hide();
                    this.el.filePanelDocumentPreview.show();
                });
            }
        })

        this.el.btnClosePanelDocumentPreview.on('click', e => {
            this.el.panelDocumentPreview.hide();
            this.el.panelMessagesContainer.show();
        });

        this.el.btnSendDocument.on('click', e => {

            let file = this.el.inputDocument.files[0];

            if (file.simpleType() === 'pdf') {

                Base64.toFile(this.el.imgPanelDocumentPreview.src).then( filePreview => {

                    Message.sendDocument(
                        this._contatActive.chatId, 
                        this._user.email, 
                        file, 
                        filePreview,
                        this.el.infoPanelDocumentPreview.innerHTML
                    );

                });

            } else {
                Message.sendDocument(
                    this._contatActive.chatId, 
                    this._user.email, 
                    file
                );
            }

            this.el.btnClosePanelDocumentPreview.click();

            this.closeAllMainPanels();
            this.el.panelMessagesContainer.show();
        });

        this.el.btnAttachContact.on('click', e => {
            this._contactsController = new ContactsController(this.el.modalContacts, this._user);
            this._contactsController.on('select', contact => {
                Message.sendContact(this._contatActive.chatId, this._user.email, contact);
            });
            this._contactsController.open();
        });

        this.el.btnCloseModalContacts.on('click', e => {
            this._contactsController.close();
        });

        // Final da inicialização dos eventos relacionados com o menu Atach


        // Inicialização dos eventos relacionados ao microfone
        this.el.btnSendMicrophone.on('click', e => {

            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();

            this._microphoneController = new MicrophoneController();

            this._microphoneController.on('ready', musica => {
                this._microphoneController.startRecorder();
                console.log('ready', musica);
            });

            this._microphoneController.on('recordTimer', timer => {
                this.el.recordMicrophoneTimer.innerHTML = Format.time(timer);
            });
        });

        this.el.btnCancelMicrophone.on('click', e => {
            this._microphoneController.stopRecorder()
            this.closeRecordMicrophone()
        })

        this.el.btnFinishMicrophone.on('click', e => {

            this._microphoneController.on('recorded', (file, metadata) => {

                Message.sendAudio(this._contatActive.chatId, this._user, file, metadata);

            });

            this._microphoneController.stopRecorder();

            this.closeRecordMicrophone();

        })

        // Final da inicialização dos eventos relacionados ao microfone


        //Inicialização dos eventos realcionados ao envio de mensagem

        this.el.inputText.on('keyup', e => {
            this.toggleInputTextFeature();
        })

        this.el.btnSend.on('click', e => {
            Message.send(this._contatActive.chatId, this._user.email, 'text', this.el.inputText.innerHTML);
            this.clearInputText();
        })
        
        this.el.inputText.on('keypress', e => {
            if (e.key === 'Enter' && !e.ctrlKey) {
                e.preventDefault();
                this.el.btnSend.click();
            }
        })

        this.el.btnEmojis.on('click', e => {
            this.el.panelEmojis.toggleClass('open');
        })

        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
            emoji.on('click', e => {
                let img = this.el.imgEmojiDefault.cloneNode();
                
                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;
                emoji.classList.forEach(name => {
                    img.classList.add(name);
                });

                let cursor = window.getSelection();
                if (cursor.focusNode || cursor.focusNode != 'input-text') {
                    this.el.inputText.focus();
                    cursor = window.getSelection();
                }

                let range = cursor.getRangeAt(0);
                range.deleteContents();

                let fragment = document.createDocumentFragment();
                fragment.appendChild(img);
                range.insertNode(fragment);
                range.setStartAfter(img);
                this.toggleInputTextFeature();
            })
        })
        
        //Final da inicialização dos eventos realcionados ao envio de mensagem

    }

    closeAllLeftPanels() {
        this.el.panelEditProfile.hide();
        this.el.panelAddContact.hide();
    }

    closeAllMainPanels() {
        this.el.panelMessagesContainer.hide();
        this.el.panelCamera.removeClass('open');
        this.el.panelDocumentPreview.removeClass('open');
    }

    closeMenuAttach(event) {
        document.removeEventListener('click', this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');
    }

    closeRecordMicrophone() {
        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();
        this.el.recordMicrophoneTimer.innerHTML = '00:00';
    }


    clearInputText() {
        this.el.inputText.innerHTML = '';
        this.el.inputPlaceholder.show();
        this.el.btnSendMicrophone.show();
        this.el.btnSend.hide();
        this.el.panelEmojis.removeClass('open');
    }

    toggleInputTextFeature() {
        if (this.el.inputText.innerHTML.length) {
            this.el.inputPlaceholder.hide();
            this.el.btnSendMicrophone.hide();
            this.el.btnSend.show();
        } else {
            this.el.inputPlaceholder.show();
            this.el.btnSendMicrophone.show();
            this.el.btnSend.hide();
        }
    }
}