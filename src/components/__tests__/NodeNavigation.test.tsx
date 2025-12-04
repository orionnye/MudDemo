import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NodeNavigation from '../NodeNavigation';
import TreeProvider from '../TreeProvider';
import UserProvider from '../UserProvider';
import { useTree } from '../TreeProvider';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TreeProvider>
    <UserProvider>{children}</UserProvider>
  </TreeProvider>
);

const NavigationHelper = () => {
  const { navigateToNode } = useTree();
  return (
    <div>
      <button onClick={() => navigateToNode('room1')}>Go to Room1</button>
      <button onClick={() => navigateToNode('room2')}>Go to Room2</button>
    </div>
  );
};

describe('NodeNavigation', () => {
  it('should render placeholder when history is empty', () => {
    render(
      <TestWrapper>
        <NodeNavigation />
      </TestWrapper>
    );

    expect(screen.getByText(/No navigation history yet/i)).toBeInTheDocument();
  });

  it('should display most recent node after navigation', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <NavigationHelper />
        <NodeNavigation />
      </TestWrapper>
    );

    const goToRoom1 = screen.getByText('Go to Room1');
    await user.click(goToRoom1);

    await waitFor(() => {
      expect(screen.getByText(/dimly lit chamber/i)).toBeInTheDocument();
    });
  });
});

