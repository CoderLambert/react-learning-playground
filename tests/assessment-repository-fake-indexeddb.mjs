function clone(value) {
  return value == null ? value : structuredClone(value);
}

class FakeRequest {
  constructor(run) {
    this.result = undefined;
    this.error = null;
    this.onsuccess = null;
    this.onerror = null;
    queueMicrotask(() => {
      try {
        this.result = run();
        this.onsuccess?.({ target: this });
      } catch (error) {
        this.error = error;
        this.onerror?.({ target: this });
      }
    });
  }
}

class FakeTransaction {
  constructor(database, storeNames, mode) {
    this.database = database;
    this.storeNames = Array.isArray(storeNames) ? storeNames : [storeNames];
    this.mode = mode;
    this.pending = 0;
    this.aborted = false;
    this.oncomplete = null;
    this.onerror = null;
    this.onabort = null;
    this.views = new Map();
    for (const name of this.storeNames) {
      const source = database.stores.get(name);
      if (!source) throw new Error(`Unknown object store: ${name}`);
      this.views.set(name, mode === "readwrite" ? new Map(source.records) : source.records);
    }
  }

  objectStore(name) {
    if (!this.views.has(name)) throw new Error(`Store ${name} is not in transaction scope`);
    return new FakeObjectStore(this, name);
  }

  request(run) {
    this.pending += 1;
    const request = new FakeRequest(() => {
      if (this.aborted) throw new Error("transaction aborted");
      const value = run();
      this.pending -= 1;
      if (this.pending === 0) queueMicrotask(() => this.complete());
      return value;
    });
    request.onerror = (event) => {
      this.pending = Math.max(0, this.pending - 1);
      this.onerror?.(event);
      this.abort(request.error);
    };
    return request;
  }

  complete() {
    if (this.aborted || this.pending !== 0) return;
    if (this.mode === "readwrite") {
      for (const name of this.storeNames) {
        this.database.stores.get(name).records = this.views.get(name);
      }
    }
    this.oncomplete?.();
  }

  abort(error = new Error("transaction aborted")) {
    if (this.aborted) return;
    this.aborted = true;
    this.error = error;
    this.pending = 0;
    queueMicrotask(() => this.onabort?.({ target: this }));
  }
}

class FakeObjectStore {
  constructor(transaction, name) {
    this.transaction = transaction;
    this.name = name;
  }

  get records() {
    return this.transaction.views.get(this.name);
  }

  get(key) {
    return this.transaction.request(() => clone(this.records.get(key)));
  }

  getAll() {
    return this.transaction.request(() => [...this.records.values()].map(clone));
  }

  put(value) {
    return this.transaction.request(() => {
      const key = value.id ?? value.mutationId;
      if (key == null) throw new Error(`Missing key for ${this.name}`);
      this.records.set(key, clone(value));
      return key;
    });
  }

  add(value) {
    return this.transaction.request(() => {
      const key = value.id ?? value.mutationId;
      if (key == null) throw new Error(`Missing key for ${this.name}`);
      if (this.records.has(key)) {
        const error = new Error(`Duplicate key: ${key}`);
        error.name = "ConstraintError";
        throw error;
      }
      this.records.set(key, clone(value));
      return key;
    });
  }
}

class FakeDatabase {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.stores = new Map();
    this.onversionchange = null;
    this.closed = false;
  }

  get objectStoreNames() {
    return {
      contains: (name) => this.stores.has(name),
    };
  }

  createObjectStore(name, options = {}) {
    if (this.stores.has(name)) throw new Error(`Store already exists: ${name}`);
    const store = {
      name,
      keyPath: options.keyPath,
      records: new Map(),
      indexes: new Map(),
    };
    this.stores.set(name, store);
    return {
      indexNames: { contains: (indexName) => store.indexes.has(indexName) },
      createIndex(indexName, keyPath, indexOptions) {
        store.indexes.set(indexName, { keyPath, options: indexOptions ?? null });
      },
    };
  }

  transaction(storeNames, mode = "readonly") {
    if (this.closed) throw new Error("database is closed");
    return new FakeTransaction(this, storeNames, mode);
  }

  close() {
    this.closed = true;
  }
}

export class FakeIndexedDB {
  constructor() {
    this.databases = new Map();
  }

  open(name, version) {
    const request = {
      result: null,
      transaction: null,
      error: null,
      onupgradeneeded: null,
      onsuccess: null,
      onerror: null,
      onblocked: null,
    };
    queueMicrotask(() => {
      try {
        let database = this.databases.get(name);
        const oldVersion = database?.version ?? 0;
        if (!database) {
          database = new FakeDatabase(name, version);
          this.databases.set(name, database);
        }
        if (version < oldVersion) throw new Error("VersionError");
        request.result = database;
        if (version > oldVersion) {
          database.version = version;
          request.transaction = { abort() {} };
          request.onupgradeneeded?.({ oldVersion, newVersion: version });
        }
        request.onsuccess?.({ target: request });
      } catch (error) {
        request.error = error;
        request.onerror?.({ target: request });
      }
    });
    return request;
  }
}
