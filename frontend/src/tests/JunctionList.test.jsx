import { render, screen, fireEvent } from '@testing-library/react';
import JunctionList from '../components/RankingsPageComponents/JunctionList';

describe(JunctionList, () => {
  const mockJunctions = [
    { name: 'Junction A', score: 95, highlight: true },
    { name: 'Junction B', score: 85, highlight: false },
    { name: 'Junction C', score: 75, highlight: false }
  ];

  it("renders without crashing", () => {
    render(<JunctionList junctions={mockJunctions} onSelect={ () => {} }/>);
  });

  it('renders all junctions from the provided data', () => {
    render(<JunctionList junctions={mockJunctions} onSelect={() => {}} />);

    // Check if all junction names are rendered
    expect(screen.getByText('Junction A')).toBeInTheDocument();
    expect(screen.getByText('Junction B')).toBeInTheDocument();
    expect(screen.getByText('Junction C')).toBeInTheDocument();

    // Check if all scores are rendered
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('applies highlight class to only highlighted junctions', () => {
    const { container } = render(
        <JunctionList junctions={mockJunctions} onSelect={() => {}} />
    );

    const junctionRows = container.getElementsByClassName('junctionRow');
    expect(junctionRows[0]).toHaveClass('highlighted');
    expect(junctionRows[1]).not.toHaveClass('highlighted');
    expect(junctionRows[2]).not.toHaveClass('highlighted');
  });

  it('calls onSelect with the correct junction when clicked', () => {
    const mockOnSelect = jest.fn();
    render(<JunctionList junctions={mockJunctions} onSelect={mockOnSelect} />);

    // Click the first junction
    fireEvent.click(screen.getByText('Junction A'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockJunctions[0]);

    // Click the second junction
    fireEvent.click(screen.getByText('Junction B'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockJunctions[1]);
  });

  it('renders empty list when no junctions provided', () => {
    const { container } = render(<JunctionList junctions={[]} onSelect={() => {}} />);
    const junctionList = container.getElementsByClassName('junctionList')[0];
    expect(junctionList.children.length).toBe(0);
  });
});
