import { render, screen } from '@testing-library/react';
import JunctionForm from '../components/MainPageComponents/JunctionForm';

describe(JunctionForm, () => {
  it("junction Form renders successfully", () => {
    render(<JunctionForm/>);

    const title = screen.getByText(/Junction Traffic Flow Model/i);
    expect(title).toBeInTheDocument();

    const northBound = screen.getByText(/NorthBound/i);
    const southBound = screen.getByText(/SouthBound/i);
    const eastBound = screen.getByText(/EastBound/i);
    const westBound = screen.getByText(/WestBound/i);

    expect(northBound).toBeInTheDocument();
    expect(southBound).toBeInTheDocument();
    expect(eastBound).toBeInTheDocument();
    expect(westBound).toBeInTheDocument();
  });
});