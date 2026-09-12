export function requestToPromise(request, { errorMessage = "IndexedDB request failed" } = {}) {
  if (!request || typeof request !== "object") {
    throw new TypeError("IndexedDB request is required");
  }

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error(errorMessage));
  });
}

export function transactionDone(transaction) {
  if (!transaction || typeof transaction !== "object") {
    throw new TypeError("IndexedDB transaction is required");
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(
      transaction.error ?? new Error("IndexedDB transaction failed"),
    );
    transaction.onabort = () => reject(
      transaction.error ?? new Error("IndexedDB transaction aborted"),
    );
  });
}

export function openIndexedDb({ indexedDb, name, version, migrate } = {}) {
  if (!indexedDb || typeof indexedDb.open !== "function") {
    throw new TypeError("indexedDb.open is required");
  }
  if (typeof name !== "string" || !name.trim()) {
    throw new TypeError("IndexedDB name is required");
  }
  if (!Number.isInteger(version) || version < 1) {
    throw new TypeError("IndexedDB version must be a positive integer");
  }
  if (migrate != null && typeof migrate !== "function") {
    throw new TypeError("IndexedDB migrate must be a function");
  }

  return new Promise((resolve, reject) => {
    const request = indexedDb.open(name, version);

    request.onupgradeneeded = (event) => {
      try {
        migrate?.({
          db: request.result,
          transaction: request.transaction,
          oldVersion: event.oldVersion,
          newVersion: event.newVersion ?? version,
          request,
        });
      } catch (error) {
        request.transaction?.abort?.();
        reject(error);
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      if (db && "onversionchange" in db) {
        db.onversionchange = () => db.close?.();
      }
      resolve(db);
    };
    request.onerror = () => reject(request.error ?? new Error("Unable to open IndexedDB"));
    request.onblocked = () => reject(new Error("IndexedDB upgrade is blocked by another tab"));
  });
}
