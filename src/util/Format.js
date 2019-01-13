export class Format {
    static getCamelCase(id) {
        let div = document.createElement('div');
        div.innerHTML = `<div data-${id}="id"></div>`;
        return Object.keys(div.firstChild.dataset)[0];
    }

    static date(date) {
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }

    static time(time) {

        let seconds = Math.floor(time/1000);
        let minutes = Math.floor(seconds/60);
        seconds = (seconds % 60);

        return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0') ;

    }

    static timeStampToTime(timeStamp) {
        return (timeStamp && typeof timeStamp.toDate === 'function') ? Format.dateToTime(timeStamp.toDate()) : '';
    }

    static dateToTime(date, locale = 'pt-BR') {
        return date.toLocaleTimeString(locale, {
            hours: '2-digits',
            minutes: '2-digits'
        })
    }
}


