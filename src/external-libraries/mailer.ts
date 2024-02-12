import { IMailer } from "../interfaces/IMailer";


export class Mailer implements IMailer{
    SendEmail(to: String, product: unknown) {
        

        // emil sendign logic
        console.log('sending Email')
        return true
    }
}