import * as EmailTemplate from 'email-templates';
import { Container } from 'typedi';
import { EmailConfig } from '../interfaces/email-config.interface';
import { ErrorHandler } from '../services/error-handler.service';

export class Email extends EmailTemplate {
    errorHandler: ErrorHandler;

    // TODO: this EmailConfig interface should come from the package...
    constructor(options: EmailConfig) {
        super(options);

        this.errorHandler = Container.get(ErrorHandler);
    }

    // TODO: get the type for this param
    /**
     *
     * @param mailData
     *
     * This function wraps the standard email-templates send function.
     * It returns true or false to indicate if the email was sent successfully
     * and will also log to the error handler.
     */
    async send(mailData: any) {
        try {
            const response = await super.send(mailData);

            if (response[0] && response[0].statusCode && response[0].statusCode === 202) {
                return true;
            }
            return false;
        }
        catch (error) {
            this.errorHandler.captureException(error);
            return false;
        }
    }
}
