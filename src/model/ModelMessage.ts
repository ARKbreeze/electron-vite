import { ModelBase } from './ModelBase';

export class ModelMessage extends ModelBase {
  createTitme?: number;
  receiveTime?: number;
  messageContent?: string;
  chatId?: string;
  fromName?: string;
  avatar?: string;
  /** 是否为传入消息 */
  isInMsg?: boolean;
}
