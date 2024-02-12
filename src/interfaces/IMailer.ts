export interface IMailer{
    SendEmail(to:String, product:unknown):any;
}