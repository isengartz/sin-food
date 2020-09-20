import { Subjects } from "../subjects";

export interface UserUpdatedEvent {
  subject: Subjects.UserUpdated;
  data: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    addresses: {
      description: string;
      floor: string;
      full_address: string;
      latitude: string;
      longitude: string;
    }[];
    phone: string;
  };
}
