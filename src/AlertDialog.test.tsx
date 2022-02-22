import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import AlertDialog from "./AlertDialog";

test("shows the alert dialog", async () => {
  render(<AlertDialog />);

  userEvent.click(screen.getByRole("button", { name: "Open alert dialog" }));

  expect(
    screen.getByRole("heading", { name: "Use Google's location service?" })
  ).toBeInTheDocument();

  userEvent.click(screen.getByRole("button", { name: "Disagree" }));

  expect(
    screen.queryByRole("heading", { name: "Use Google's location service?" })
  ).not.toBeInTheDocument();

  expect(
    await screen.findByRole("button", { name: "Open alert dialog" })
  ).toBeInTheDocument();
});
