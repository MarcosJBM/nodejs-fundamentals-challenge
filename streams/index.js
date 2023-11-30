import { parse } from 'csv-parse';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const path = `${__dirname}/tasks.csv`;

const apiUrl = 'http://localhost:3333/tasks';

async function importTasks() {
  const parser = fs.createReadStream(path).pipe(parse({ from_line: 2 }));

  for await (const record of parser) {
    const task = { title: record[0], description: record[1] };

    await fetch(apiUrl, { body: JSON.stringify(task), method: 'POST' });
  }
}

await importTasks();
