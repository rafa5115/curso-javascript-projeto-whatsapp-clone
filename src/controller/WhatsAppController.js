import {Format} from './../util/Format';
import {CameraController} from './CameraController';
import {DocumentPreviewController} from './DocumentPreviewController';

export class WhatsAppController{
    constructor() {
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
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

    initEvents() {

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

        this.el.inputNamePanelEditProfile.on('keypress', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();
            }
        });

        this.el.btnSavePanelEditProfile.on('click', e => {
            e.preventDefault();
            console.log(this.el.inputNamePanelEditProfile.innerHTML);
        });

        this.el.formPanelAddContact.on('submit', e => {
            e.preventDefault();
            console.log(this.el.formPanelAddContact.toJSON());
            this.el.panelAddContact.hide();
        });

        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(contact => {
            contact.on('click', e => {
                this.el.home.hide();
                this.el.main.css({
                    display: 'flex'
                });
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
            console.log(this.el.inputPhoto.files);
            [...this.el.inputPhoto.files].forEach(file => {
                console.log(file);
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
            console.log(this.el.pictureCamera.src);
        })
        

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
            console.log('Send Document');
            this.closeAllMainPanels();
            this.el.panelMessagesContainer.show();
        });

        this.el.btnAttachContact.on('click', e => {
            this.el.modalContacts.show();
        });

        this.el.btnCloseModalContacts.on('click', e => {
            this.el.modalContacts.hide();
        });

        // Final da inicialização dos eventos relacionados com o menu Atach


        // Inicialização dos eventos relacionados ao microfone
        this.el.btnSendMicrophone.on('click', e => {
            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();
            this.startRecordMicrophoneTime();
        });

        this.el.btnCancelMicrophone.on('click', e => {
            this.closeRecordMicrophone()
        })

        this.el.btnFinishMicrophone.on('click', e => {
            this.closeRecordMicrophone()
        })

        // Final da inicialização dos eventos relacionados ao microfone


        //Inicialização dos eventos realcionados ao envio de mensagem

        this.el.inputText.on('keyup', e => {
            this.toggleInputTextFeature();
        })

        this.el.btnSend.on('click', e => {
            console.log(this.el.inputText.innerHTML);
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
        clearInterval(this._recordMicrophoneInterval);
        this.el.recordMicrophoneTimer.innerHTML = '00:00';
    }

    startRecordMicrophoneTime() {
        let start = Date.now();
        this._recordMicrophoneInterval = setInterval(() => {
            this.el.recordMicrophoneTimer.innerHTML = Format.time(Date.now() - start);
        }, 1000);
    }

    clearInputText() {
        this.el.inputText.innerHTML = '';
        this.el.inputPlaceholder.show();
        this.el.btnSendMicrophone.show();
        this.el.btnSend.hide();
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