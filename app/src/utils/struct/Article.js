import dayjs from "dayjs";

export class Article {
    constructor(publicKey, account) {
        this.timestamp = account.timestamp
        this.publicKey = publicKey
        this.author = account.author
        this.content = account.content
    }

    get created_at_display () {
        return dayjs.unix(this.timestamp).format('lll')
    }

}