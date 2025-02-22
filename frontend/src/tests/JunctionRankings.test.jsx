import { render, screen, fireEvent, getByRole } from '@testing-library/react';
import JunctionRankings from '../components/RankingsPageComponents/JunctionRankings.js';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// TODO: Waiting on new UI designs before continuing with these tests

// TODO: Additional tests:
// 1. Check junctionlist renders (with correct junctions?)
// 2. Check score breakdown renders (with correct junction name and score?)
// 3. Check configurable parameters renders
// 4. Check back button works

describe('JunctionRankings', () => {
  test('renders component correctly', () => {
    render(
      <BrowserRouter>
        <JunctionRankings />
      </BrowserRouter>
    );
    
    // Check if the title is rendered
    const titleElement = screen.getByText('Junction Rankings');
    expect(titleElement).toBeInTheDocument();
    
    // Check if the subtitle is rendered
    const subtitleElement = screen.getByText('Click on a score to see how it was calculated');
    expect(subtitleElement).toBeInTheDocument();
    
    // Check if the Back to Junction Configuration Menu button is rendered
    const backButtonElement = screen.getByRole('button');
    expect(backButtonElement).toBeInTheDocument();
  });
});