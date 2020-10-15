import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ImapSimple } from 'imap-simple';
import { User } from 'src/auth/user.entity';
import { ImapService } from 'src/imap/imap.service';
import { AddBoxDto } from './dto/add-box.dto';

@Injectable()
export class BoxesService {
  constructor(private imapService: ImapService) {}

  async getBoxes(user: User): Promise<string[]> {
    const imapConnection: ImapSimple = await this.imapService.createConnection(
      user,
    );
    const boxes = await imapConnection.getBoxes();
    return Object.keys(boxes);
  }

  async addBox(addBoxDto: AddBoxDto, user: User): Promise<void> {
    const { box = 'INBOX' } = addBoxDto;
    const imapConnection: ImapSimple = await this.imapService.createConnection(
      user,
    );
    try {
      await imapConnection.addBox(box);
    } catch (e) {
      throw new ConflictException();
    }
  }

  async deleteBox(addBoxDto: AddBoxDto, user: User): Promise<void> {
    const { box } = addBoxDto;
    const imapConnection: ImapSimple = await this.imapService.createConnection(
      user,
    );
    try {
      await imapConnection.delBox(box);
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
