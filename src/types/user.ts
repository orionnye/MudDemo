import { Node } from '../models/Node';

export interface User {
  health: number;
  text: string;
  navigationHistory: Node[];
  wisdom: number;
}

