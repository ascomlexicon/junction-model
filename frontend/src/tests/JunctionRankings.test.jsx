import { render, screen, fireEvent, getByRole } from '@testing-library/react';
import JunctionRankings from '../components/RankingsPageComponents/JunctionRankings.js';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

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
    const backButtonElement = screen.getByRole('button', { name: /Back to Junction Configuration Menu/i });
    expect(backButtonElement).toBeInTheDocument();
    
  });
});