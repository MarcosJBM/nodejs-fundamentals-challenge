import { createServer } from 'node:http';

import { json } from './middlewares/index.js';
import { routes } from './routes/index.js';
import { extractQueryParams } from './utils/index.js';

const HOSTNAME = 'localhost';
const PORT = 3333;

const server = createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  const route = routes.find(route => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = request.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    request.params = params;
    request.query = extractQueryParams(query);

    return route.handler(request, response);
  }

  return response.writeHead(404).end();
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
