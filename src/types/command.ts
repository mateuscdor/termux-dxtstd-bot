export interface CommandType {
    default: (client: any, data: any, logger: any) => void;
    permission: {
        owner: boolean;
        admin: {
            bot: boolean;
            normal: boolean;
            super: boolean;
        };
        premium: boolean;
        group: boolean;
        private: boolean;
    };
    need: {
        register: boolean;
        limit: {
            amount: number;
        };
        cash: {
            amount: number
        };
        level: number;
    };
    name: string;
    help: Array<string>;
    use: RegExp;
    disable: boolean;
    beta: boolean;
    support: {
        android: boolean;
        linux: boolean;
        windows: boolean
    }
}
