import fs from 'node:fs';

function filterSearchValues(search) {
  let newSearch = {};

  for (const key in search) {
    if (search[key]) {
      if (
        typeof search[key] === 'string' ||
        typeof search[key] === 'boolean' ||
        typeof search[key] === 'number'
      ) {
        newSearch[key] = search[key];
      }
    }
  }

  return newSearch;
}

function hasPropertiesWithValues(object) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && object[key]) {
      return true;
    }
  }

  return false;
}

export class Database {
  #database = {};
  #databasePath = new URL('../db.json', import.meta.url);

  constructor() {
    fs.readFile(this.#databasePath, 'utf8', (error, data) => {
      if (error) return this.#persist();

      return (this.#database = JSON.parse(data));
    });
  }

  #persist() {
    fs.writeFile(this.#databasePath, JSON.stringify(this.#database), error => {
      if (error) console.error(error);
    });
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    const filteredSearch = filterSearchValues(search);

    const hasPropertiesWithValuesInSearch =
      hasPropertiesWithValues(filteredSearch);

    if (hasPropertiesWithValuesInSearch) {
      data = data.filter(row => {
        return Object.entries(filteredSearch).some(([key, value]) => {
          return row[key].includes(value);
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else this.#database[table] = [data];

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
