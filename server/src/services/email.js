class EmailService {
  constructor(payload) {
    this.to = payload.email
    this.type = payload.type
    this.from = payload.form
  }



  send = async () => {}

  sendForgetPasswordMail = async() => {

  }
}

export default EmailService
 