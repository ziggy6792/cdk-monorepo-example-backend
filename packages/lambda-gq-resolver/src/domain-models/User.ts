/* eslint-disable max-classes-per-file */
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

@table('User')
class User {
  @hashKey({ defaultProvider: () => uuidv4() })
  id: string;

  @attribute()
  email: string;

  @attribute()
  phone: string;

  @attribute()
  telegramChatId: string;

  @attribute()
  priority: number;

  @attribute()
  firstName: string;

  @attribute()
  lastName: string;

  @attribute()
  isNotifyEnabled: boolean;

  @attribute()
  isBookEnabled: boolean;

  generateId(): string {
    this.id = this.getFullName().toLowerCase().replace(/\s/g, '-');
    if (!this.id) {
      this.id = uuidv4();
    }
    return this.id;
  }

  getFullName(): string {
    const { firstName, lastName } = this;
    return `${firstName}${lastName ? ` ${lastName}` : ''}`;
  }

  toString(): string {
    const fullName = this.getFullName();
    const toStrList = [];
    if (fullName) {
      toStrList.push(fullName);
    } else {
      toStrList.push(this.id);
    }
    if (this.phone) {
      toStrList.push(`(phone: ${this.phone}`);
    }
    if (this.telegramChatId) {
      toStrList.push(`(telegram: ${this.telegramChatId})`);
    }
    return toStrList.join(' ');
  }
}

export default User;
