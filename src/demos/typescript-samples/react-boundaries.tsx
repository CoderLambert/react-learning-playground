import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from "react";

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

type SingleElementSlotProps = {
  child: ReactElement;
};

export function SingleElementSlot({ child }: SingleElementSlotProps) {
  return <div className="slot">{child}</div>;
}

type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export function renderLoadState<T>(state: LoadState<T>, renderData: (data: T) => ReactNode) {
  switch (state.status) {
    case "idle":
      return "尚未请求";
    case "loading":
      return "加载中…";
    case "success":
      return renderData(state.data);
    case "error":
      return `失败：${state.error.message}`;
  }
}

type TabValue = "overview" | "activity" | "settings";

type ControlledTabsProps = {
  value: TabValue;
  onValueChange: (nextValue: TabValue) => void;
};

export function ControlledTabs({ value, onValueChange }: ControlledTabsProps) {
  const tabs: readonly TabValue[] = ["overview", "activity", "settings"];

  return (
    <div>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          aria-pressed={value === tab}
          onClick={() => onValueChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function TypeErrorExamples() {
  // These are compile-time assertions for a future `tsc` gate.
  // They are not meant to be executed in the browser Demo.

  // @ts-expect-error ReactElement intentionally rejects a primitive string here.
  const invalidElement = <SingleElementSlot child="plain text" />;

  // @ts-expect-error Controlled contract requires both value and onValueChange.
  const incompleteControlledTabs = <ControlledTabs value="overview" />;

  // @ts-expect-error success state requires data; error belongs to another union branch.
  const impossibleState: LoadState<string> = { status: "success", error: new Error("wrong branch") };

  return (
    <>
      {invalidElement}
      {incompleteControlledTabs}
      {renderLoadState(impossibleState, (value) => value)}
    </>
  );
}
