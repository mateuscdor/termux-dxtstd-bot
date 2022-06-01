export interface UserType {
    id: string;
    uid: string;
    profile: {
        name: {
            notify: string;
            contact: string;
        };
    };
    status: {
        verified: boolean;
        banned: boolean;
        premium: {
            active: boolean;
            expired: number;
        };
    };
    level: number;
    exp: {
        current: number;
        need: number;
    };
    cash: number;
    history: {
        purchase: any;
        donate: any;
        command: {
            last: string;
        };
    };
    is: {
        owner: boolean;
        coowner: boolean;
        admin: {
            super: boolean;
            normal: boolean;
        };
    };
}