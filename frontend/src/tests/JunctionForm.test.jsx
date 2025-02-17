import { render, screen } from '@testing-library/react';
import JunctionForm from '../components/MainPageComponents/JunctionForm';

// Most of the testing is done in the JunctionInput.test.jsx file
// This test is just to make sure the form renders correctly
describe(JunctionForm, () => {
  it('junction Form renders successfully', () => {
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

  it('junction form renders correct number of inputs', () => {
    render(<JunctionForm/>);

    const junctionInputs = screen.getAllByRole('textbox');
    expect(junctionInputs).toHaveLength(16);
  });
});