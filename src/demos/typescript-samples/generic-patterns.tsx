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
type Product = { sku: string; label: string };

const users: User[] = [
  { id: "u1", name: "Ada" },
  { id: "u2", name: "Lin" },
];

export function GenericExample() {
  const selected = useHistory<User | null>(null);

  return (
    <>
      <SelectList<User>
        items={users}
        getKey={(user) => user.id}
        renderItem={(user) => user.name}
        onSelect={selected.update}
      />
      <p>Selected: {selected.current?.name ?? "none"}</p>
    </>
  );
}

export function GenericTypeErrorExamples() {
  const selected = useHistory<User | null>(null);
  const product: Product = { sku: "p1", label: "Book" };

  // @ts-expect-error update keeps the same T chosen by useHistory<User | null>.
  selected.update(product);

  // @ts-expect-error SelectList<User> keeps renderItem's input tied to User.
  const wrongRenderer: (item: User) => ReactNode = (item: Product) => item.label;

  return (
    <SelectList<User>
      items={users}
      getKey={(user) => user.id}
      renderItem={wrongRenderer}
      onSelect={selected.update}
    />
  );
}
