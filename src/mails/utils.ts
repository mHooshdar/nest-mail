import { EmailAddress } from 'mailparser';

export function generateEmailObject(sender: string): EmailAddress[] {
  const splitedSections = sender.split(', ');

  const result = [];

  for (let i = 0; i < splitedSections.length; i++) {
    let name = '';
    let address = '';
    const splitedSender = splitedSections[i].split(' <');

    if (splitedSender.length === 1) {
      address = splitedSender[0].replace(/[<> ]/, '');
    } else {
      const tempName = splitedSender[0].replace(/"/g, '');
      address = splitedSender[1].replace(/[<> ]/, '');
      if (tempName && tempName !== address) {
        name = tempName;
      }
    }

    result.push({
      name,
      address,
    });
  }

  return result;
}

export const generateEmailAddress = email =>
  email.split(', ').map(address => ({
    name: '',
    address,
  }));
