import { useState, type ReactNode } from "react";

type SelectListProps<T> = {
  items: readonly T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onSelect: (item: T) => void;
};

export function SelectList<T>({ items, getKey, renderItem, onSelect }: SelectListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>
          <button type="button" onClick={() => onSelect(item)}>
            {renderItem(item)}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function useHistory<T>(initialValue: T) {
  const [current, setCurrent] = useState<T>(initialValue);
  const [history, setHistory] = useState<T[]>([initialValue]);

  function update(nextValue: T) {
    setCurrent(nextValue);
    setHistory((items) => [...items, nextValue]);
  }

  return { current, history, update } as const;
}

type User = { id: string; name: string };

const users: User[] = [
  { id: "u1", name: "Ada" },
  { id: "u2", name: "Lin" },
];

export function Example() {
  const selected = useHistory<User | null>(null);

  return (
    <>
      <SelectList
        items={users}
        getKey={(user) => user.id}
        renderItem={(user) => user.name}
        onSelect={selected.update}
      />
      <p>Selected: {selected.current?.name ?? "none"}</p>
    </>
  );
}
