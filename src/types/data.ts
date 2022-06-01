import { Chat } from "./chat"
import { User } from "./database"

export declare interface Text {
    full: string;
    args: Array<string>;
    body: string;
    command: string|undefined;
}

export interface DataType {
    data: Data;
    chat: Chat;
    type: string;
    from: string;
    on: {
        group: boolean;
        private: boolean;
    };
    sender: string;
    group: object;
    user: User;
    name: {
        user: string;
        group: string;
    };
    text: Text
}
