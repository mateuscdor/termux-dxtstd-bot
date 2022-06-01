import { proto as WAProto } from "@adiwajshing/baileys"
import { IsChat, OptsDownload } from './simpler'

export interface ChatType {
    key: WAProto.MessageKey;
    message: any;
    pushName: string;
    is: IsChat;
    download: (opts: OptsDownload) => any;
    resend: (opts: OptsResend) => void;
}
