export interface Config {
    owner: {
        profile: {
            name: string
        };
        noPhone: string;
        donate: {
            saweria: string;
            paypal: string
        }
    };
    coowner: {
        profile: {
            name: string
        };
        noPhone: string
    };
    timezone: string;
    website: string;
    prefix: string;
    ReadOnly: boolean;
    QRImage: boolean;
    DB_SERVER: string;
}
