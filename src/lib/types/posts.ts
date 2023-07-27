import {Author} from 'lib/types/users';

export interface Post {
  id: string;
  title: string;
  postedAt: string;
  authorID: string;
}
