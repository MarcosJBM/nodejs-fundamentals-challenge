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
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.query;

      const tasks = database.select('tasks', {
        title,
        description,
      });

      return response.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;

      const { title, description } = request.body;

      const tasks = database.select('tasks');

      const task = tasks.find(task => task.id === id);

      if (!task) return response.writeHead(404).end();

      const updatedTask = {
        title: title || task.title,
        description: description || task.description,
        completed_at: task.completed_at,
        created_at: task.created_at,
        updated_at: new Date(),
      };

      database.update('tasks', id, updatedTask);

      return response.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;

      const tasks = database.select('tasks');

      const task = tasks.find(task => task.id === id);

      if (!task) return response.writeHead(404).end();

      database.delete('tasks', id);

      return response.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params;

      const tasks = database.select('tasks');

      const task = tasks.find(task => task.id === id);

      if (!task) return response.writeHead(404).end();

      const updatedTask = {
        ...task,
        completed_at: task.completed_at ? null : new Date(),
        updated_at: new Date(),
      };

      database.update('tasks', id, updatedTask);

      return response.writeHead(204).end();
    },
  },
];
