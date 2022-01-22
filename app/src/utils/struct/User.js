import dayjs from "dayjs";

export class User {
    constructor(publicKey, account) {
        this.createdAt = account.createdAt
        this.updatedAt = account.updatedAt
        this.publicKey = publicKey
        this.author = account.author
        this.bio = account.bio
        this.pseudo = account.pseudo
    }

    get created_at_display () {
        return dayjs.unix(this.createdAt).format('lll')
    }

    get updated_at_display () {
        return dayjs.unix(this.updatedAt).format('lll')
    }

}