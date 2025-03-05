// JunctionInput.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JunctionInput from '../components/MainPageComponents/JunctionInput';

describe("JunctionInput Component", () => {
  const defaultProps = {
    incomingDirection: "North",
    outgoingDirection1: "East",
    outgoingDirection2: "South",
    outgoingDirection3: "West",
    onUpdate: jest.fn(),
    values: { enter: '', east: '', south: '', west: '' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders incoming and outgoing inputs with correct placeholders and labels", () => {
    render(<JunctionInput {...defaultProps} />);
    // Check incoming input
    expect(screen.getByPlaceholderText("Total vehicles North")).toBeInTheDocument();
    // Check outgoing labels
    expect(screen.getByText("Exit East:")).toBeInTheDocument();
    expect(screen.getByText("Exit South:")).toBeInTheDocument();
    expect(screen.getByText("Exit West:")).toBeInTheDocument();
  });

  test("calls onUpdate when the incoming input is changed", () => {
    const onUpdateMock = jest.fn();
    const values = { enter: '', east: '', south: '', west: '' };
    render(
      <JunctionInput
        {...defaultProps}
        onUpdate={onUpdateMock}
        values={values}
      />
    );
    const incomingInput = screen.getByPlaceholderText("Total vehicles North");
    fireEvent.change(incomingInput, { target: { value: "10" } });
    expect(onUpdateMock).toHaveBeenCalledWith({
      ...values,
      enter: 10
    });
  });

  test("disables outgoing inputs when incoming value is empty", () => {
    render(<JunctionInput {...defaultProps} />);
    // There are 4 number inputs: the first (entering) plus 3 outgoing ones.
    const inputs = screen.getAllByRole("spinbutton");
    // The incoming input is always enabled.
    expect(inputs[0]).not.toBeDisabled();
    // The outgoing inputs should be disabled when values.enter is falsy.
    expect(inputs[1]).toBeDisabled();
    expect(inputs[2]).toBeDisabled();
    expect(inputs[3]).toBeDisabled();
  });

  test("calls onUpdate when an outgoing input is changed", () => {
    const onUpdateMock = jest.fn();
    const values = { enter: 10, east: '', south: '', west: '' };
    render(
      <JunctionInput
        {...defaultProps}
        onUpdate={onUpdateMock}
        values={values}
      />
    );
    const eastInput = screen.getByLabelText(/Exit East:/);
    // Outgoing inputs become enabled when there is an incoming value.
    expect(eastInput).not.toBeDisabled();
    fireEvent.change(eastInput, { target: { value: "5" } });
    expect(onUpdateMock).toHaveBeenCalledWith({
      ...values,
      east: 5
    });
  });

  test("displays valid validation message and valid class for outgoing inputs when distribution is correct", () => {
    // Valid distribution: incoming 10 equals 4 + 3 + 3.
    const values = { enter: 10, east: 4, south: 3, west: 3 };
    render(
      <JunctionInput
        {...defaultProps}
        values={values}
      />
    );
    // Check for the valid validation message.
    expect(screen.getByText("Valid distribution of vehicles")).toBeInTheDocument();

    // Check outgoing inputs have the valid CSS class.
    const eastInput = screen.getByLabelText(/Exit East:/);
    const southInput = screen.getByLabelText(/Exit South:/);
    const westInput = screen.getByLabelText(/Exit West:/);
    expect(eastInput).toHaveClass("input-valid");
    expect(southInput).toHaveClass("input-valid");
    expect(westInput).toHaveClass("input-valid");
  });

  test("displays invalid validation message and invalid class for outgoing inputs when distribution does not add up", () => {
    // Invalid distribution: incoming 10 does not equal 4 + 3 + 2 (which sums to 9).
    const values = { enter: 10, east: 4, south: 3, west: 2 };
    render(
      <JunctionInput
        {...defaultProps}
        values={values}
      />
    );
    expect(
      screen.getByText("Total vehicles from North (10) must equal sum of outgoing vehicles")
    ).toBeInTheDocument();

    const eastInput = screen.getByLabelText(/Exit East:/);
    const southInput = screen.getByLabelText(/Exit South:/);
    const westInput = screen.getByLabelText(/Exit West:/);
    expect(eastInput).toHaveClass("input-invalid");
    expect(southInput).toHaveClass("input-invalid");
    expect(westInput).toHaveClass("input-invalid");
  });

  test("does not call onUpdate when non-numeric input is provided", () => {
    const onUpdateMock = jest.fn();
    const values = { enter: 10, east: '', south: '', west: '' };
    render(
      <JunctionInput
        {...defaultProps}
        onUpdate={onUpdateMock}
        values={values}
      />
    );
    const eastInput = screen.getByLabelText(/Exit East:/);
    fireEvent.change(eastInput, { target: { value: "abc" } });
    expect(onUpdateMock).not.toHaveBeenCalled();
  });
});
