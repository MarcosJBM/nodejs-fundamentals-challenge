import { randomUUID } from 'node:crypto';

import { Database } from '../database.js';
import { buildRoutePath } from '../utils/index.js';

const database = new Database();

export const tasksRoutes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert('tasks', task);

      return response.writeHead(201).end();
    },
  },
];
