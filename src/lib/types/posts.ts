import {Author} from 'lib/types/users';

export interface Feed {
  id: string;
  title: string;
  timestamp: string;
  author: Author;
  content: string;
}
