import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

type ProfileCardProps = {
  name: string;
  children?: ReactNode;
  onRename?: (nextName: string) => void;
};

export function ProfileCard({ name, children, onRename }: ProfileCardProps) {
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setDraft(event.currentTarget.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onRename?.(draft);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input ref={inputRef} value={draft} onChange={handleChange} />
      </label>
      <button type="button" onClick={() => inputRef.current?.focus()}>
        Focus
      </button>
      <button type="submit">Save</button>
      {children}
    </form>
  );
}

type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

export function renderLoadState<T>(state: LoadState<T>, renderData: (data: T) => ReactNode) {
  switch (state.status) {
    case "idle":
      return "尚未请求";
    case "loading":
      return "加载中…";
    case "success":
      return renderData(state.data);
    case "error":
      return `失败：${state.message}`;
  }
}
