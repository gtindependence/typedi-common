import * as config from 'config';
import * as nodemailerSendgrid from 'nodemailer-sendgrid';
import * as path from 'path';
import { Container } from 'typedi';
import { Email } from '../classes/email';

export function EmailProvider() {
    return (object: any, propertyName: string, index?: number) => {

        // tslint:disable-next-line:no-console
        console.warn('You need to create a config for email. See the README in @teamhive/typedi-common');

        const email = new Email({
            message: {
                from: config.get<string>('email.noReplyEmailAddress')
            },
            send: config.get<boolean>('email.send'),
            transport: nodemailerSendgrid({
                apiKey: config.get<string>('email.sendgrid.apiKey')
            }),
            preview: false,
            juice: true,
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    relativeTo: path.resolve('emails/shared')
                }
            }
        });

        Container.registerHandler({ object, propertyName, index, value: _containerInstance => email });
    };
}
