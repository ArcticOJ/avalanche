import {Author} from 'lib/types/users';

export interface Problem {
  id: string;
  title: string;
  tags: string[];
  author: Author;
}
