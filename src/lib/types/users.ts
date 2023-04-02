export interface Author {
  id: string;
  username: string;
}

export interface User {
  id: string;
  displayName: string;
  handle: string;
  email: string;
  organization: string;
  registeredAt: Date;
  avatar: string;
  // lastLogin: Date;
}

