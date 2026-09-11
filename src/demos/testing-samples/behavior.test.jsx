// Reference sample for CodeViewer. The repository does not install these test dependencies yet.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { TestingStrategyDemo } from "../TestingStrategyDemo";

test("user sees success after saving", async () => {
  const user = userEvent.setup();
  render(<TestingStrategyDemo />);

  await user.click(screen.getByRole("button", { name: "保存资料" }));

  expect(await screen.findByRole("status")).toHaveTextContent("保存成功");
});
