import { UserPayload } from '@sin-nombre/sinfood-common';

export interface UserFullPayload extends UserPayload {
  last_name: string;
  phone: string;
}
