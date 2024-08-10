import MessageResponse from "./IMessageResponse";

export interface IErrorResponse extends MessageResponse {
    stack?: string;
}

export default IErrorResponse;
