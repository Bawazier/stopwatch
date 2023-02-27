import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Stopwatch from "../pages";
import { act } from "react-dom/test-utils";

describe("Stopwatch component", () => {
  it("should renders stopwatch and controls", () => {
    render(<Stopwatch />);

    expect(
      screen.getByRole("heading", { name: /00:00.00/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
  });

  it("should show up button lap & stop when click start button", () => {
    jest.useFakeTimers();
    render(<Stopwatch />);

    // Start the stopwatch
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    act(() => {
      jest.advanceTimersByTime(10);
    });

    // Expect button stop & lap show up
    expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /lap/i })).toBeInTheDocument();
  });

  it("should starts and stops stopwatch correctly", () => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    });
    render(<Stopwatch />);

    // Start the stopwatch
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Expect setInterval called 1 time
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 10);

    // Stop the stopwatch
    // fireEvent.click(screen.getByRole("button", { name: /stop/i }));

    // Expect clearInterval called 1 time
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  it("should resets stopwatch correctly", () => {
    jest.useFakeTimers();
    render(<Stopwatch />);

    // Start the stopwatch
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Wait for 10 miliseconds to ensure that the stopwatch is running
    act(() => {
      jest.advanceTimersByTime(10);
    });

    // Expect start success
    expect(
      screen.queryByRole("heading", { name: /00:00.00/i })
    ).not.toBeInTheDocument();

    // Stop & Reset the stopwatch
    fireEvent.click(screen.getByRole("button", { name: /stop/i }));
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    // Expect reset success
    expect(
      screen.getByRole("heading", { name: /00:00.00/i })
    ).toBeInTheDocument();
  });

  it('should add a new lap when the "Lap" button is clicked', () => {
    jest.useFakeTimers();
    render(<Stopwatch />);

    // Start the stopwatch
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Wait for 1 second to ensure that the stopwatch is running
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Click the "Lap" button
    fireEvent.click(screen.getByRole("button", { name: /lap/i }));

    // Expect a new lap to have been added
    expect(screen.getByLabelText(/lap_duration/i)).toHaveTextContent(
      "00:01.00"
    );
    expect(screen.getByLabelText(/lap_time/i)).toHaveTextContent("00:01.00");

    // Wait for 1 second to ensure that the stopwatch is running
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Click the "Lap" button
    fireEvent.click(screen.getByRole("button", { name: /lap/i }));

    // Expect a new lap to have been added
    expect(screen.getByLabelText(/lap_duration/i)).toHaveTextContent(
      "00:01.00"
    );
    expect(screen.getByLabelText(/lap_time/i)).toHaveTextContent("00:02.00");
  });
});
