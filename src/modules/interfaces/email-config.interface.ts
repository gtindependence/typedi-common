export interface EmailConfig {
    /**
     * The message <Nodemailer.com/message/>
     */
    message: any;
    /**
     * The nodemailer Transport created via nodemailer.createTransport
     */
    transport?: any;
    /**
     * The email template directory and engine information
     */
    views?: any;
    /**
     *     Do you really want to send, false for test or development
     */
    send?: boolean;
    /**
     * Preview the email
     */
    preview?: boolean;
    /**
     * Set to object to configure and Enable <https://github.com/ladjs/il8n>
     */
    i18n?: any;
    /**
     * Pass a custom render function if necessary
     */
    render?: { view: string, locals: any };
    /**
     * force text-only rendering of template (disregards template folder)
     */
    textOnly?: boolean;
    /**
     * <Https://github.com/werk85/node-html-to-text>
     */
    htmlToText?: any;
    /**
     * You can pass an option to prefix subject lines with a string
     * env === 'production' ? false : `[${env.toUpperCase()}] `; // <--- HERE
     */
    subjectPrefix?: any;
    /**
     * <https://github.com/Automattic/juice>
     */
    juice?: boolean;
    /**
     * <https://github.com/Automattic/juice>
     */
    juiceResources?: any;
}
