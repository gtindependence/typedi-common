import { Breadcrumb } from '@sentry/node';

export interface Breadcrum {
    message: string;
    category?: string;
    data?: Breadcrumb['data'];
}
