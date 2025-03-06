import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ProjectLeaderboard from '../components/LeaderboardComponents/ProjectLeaderboard';
import VPHDataDisplay from '../components/LeaderboardComponents/VPHDisplayData';

// Mock the VPHDataDisplay component
jest.mock('../components/LeaderboardComponents/VPHDisplayData', () => {
  return jest.fn(({ projectData }) => (
    <div data-testid="vph-display">
      {projectData ? (
        <div>
          <h2 data-testid="project-name">{projectData.name}</h2>
          <div data-testid="vph-data">{JSON.stringify(projectData.vphData)}</div>
        </div>
      ) : (
        <div>No project selected</div>
      )}
    </div>
  ));
});

describe('ProjectLeaderboard Component', () => {
  beforeEach(() => {
    // Reset mock between tests
    VPHDataDisplay.mockClear();
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <ProjectLeaderboard />
      </MemoryRouter>
    );
  };

  test('renders without crashing', () => {
    renderWithRouter();
    expect(screen.getByText('Current Projects')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Please select a project to view VPH data')).toBeInTheDocument();
  });

  test('displays the back button with correct link', () => {
    renderWithRouter();
    const backButton = screen.getByText('Back to Junction Configuration Menu');
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute('href', '/MainPage');
  });

  test('displays a list of projects', () => {
    renderWithRouter();
    expect(screen.getByText('Coventry A')).toBeInTheDocument();
    expect(screen.getByText('Warwick')).toBeInTheDocument();
    expect(screen.getByText('Leamington North')).toBeInTheDocument();
    expect(screen.getByText('Leamington South')).toBeInTheDocument();
    expect(screen.getByText('Kings Cross')).toBeInTheDocument();
  });

  test('initially has no project selected', () => {
    renderWithRouter();
    expect(VPHDataDisplay).toHaveBeenCalledWith(
      { projectData: null },
      undefined
    );
  });

  test('selects a project when clicked', () => {
    renderWithRouter();
    
    // Click on a project
    fireEvent.click(screen.getByText('Kings Cross'));
    
    // Check that the project is highlighted
    const projectRow = screen.getByText('Kings Cross').closest('div');
    expect(projectRow).toHaveClass('highlighted');
    
    // Check that VPHDataDisplay is called with correct data
    // Get the second call (index 1) since the first call happens on initial render
    const secondCall = VPHDataDisplay.mock.calls[1];
    expect(secondCall[0]).toEqual(
      expect.objectContaining({
        projectData: expect.objectContaining({
          id: 'kings-cross',
          name: 'Kings Cross'
        })
      })
    );
  });
  
  test('can change selected project', async () => {
    renderWithRouter();
    
    // First select one project
    fireEvent.click(screen.getByText('Coventry A'));
    
    // Then select another project
    fireEvent.click(screen.getByText('Warwick'));
    
    // Check that the second project is highlighted
    const projectRow = screen.getByText('Warwick').closest('div');
    expect(projectRow).toHaveClass('highlighted');
    
    // Check that the first project is no longer highlighted
    const firstProjectRow = screen.getByText('Coventry A').closest('div');
    expect(firstProjectRow).not.toHaveClass('highlighted');
    
    // Verify VPHDataDisplay is called with the correct data
    // Get the third call (index 2) since we've made two selections
    const thirdCall = VPHDataDisplay.mock.calls[2];
    expect(thirdCall[0]).toEqual(
      expect.objectContaining({
        projectData: expect.objectContaining({
          id: 'warwick',
          name: 'Warwick'
        })
      })
    );
  });

  test('passes the correct VPH data to the display component', () => {
    renderWithRouter();
    
    // Select a project with known VPH data
    fireEvent.click(screen.getByText('Leamington North'));
    
    // Expected VPH data structure for this project
    const expectedVphData = {
      north: { entering: "780", exitEast: "230", exitSouth: "350", exitWest: "200" },
      south: { entering: "820", exitNorth: "310", exitEast: "240", exitWest: "270" },
      east: { entering: "690", exitNorth: "210", exitSouth: "230", exitWest: "250" },
      west: { entering: "750", exitNorth: "280", exitEast: "190", exitSouth: "280" }
    };
    
    // Check that VPHDataDisplay is called with correct VPH data
    expect(VPHDataDisplay).toHaveBeenLastCalledWith(
      {
        projectData: expect.objectContaining({
          vphData: expectedVphData
        })
      },
      undefined
    );
  });
});