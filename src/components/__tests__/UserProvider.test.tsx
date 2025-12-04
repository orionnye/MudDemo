import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import UserProvider, { useUser } from '../UserProvider';
import TreeProvider from '../TreeProvider';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <TreeProvider>
    <UserProvider>{children}</UserProvider>
  </TreeProvider>
);

describe('UserProvider', () => {
  it('should initialize with default user state', () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.user.health).toBe(100);
    expect(result.current.user.wisdom).toBe(4);
    expect(result.current.user.navigationHistory).toHaveLength(0);
  });

  it('should navigate to a node and add it to history', async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      result.current.navigateToNode('room1');
    });

    await waitFor(() => {
      expect(result.current.user.navigationHistory.length).toBeGreaterThan(0);
    });

    const history = result.current.user.navigationHistory;
    expect(history[history.length - 1].id).toBe('room1');
    expect(result.current.user.text).toContain('dimly lit chamber');
  });

  it('should add multiple nodes to history when navigating forward', async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    // Navigate through multiple nodes
    await act(async () => {
      result.current.navigateToNode('room1');
    });

    await act(async () => {
      result.current.navigateToNode('room2');
    });

    await act(async () => {
      result.current.navigateToNode('room4');
    });

    await waitFor(() => {
      const history = result.current.user.navigationHistory;
      expect(history.length).toBeGreaterThanOrEqual(2);
    });

    const history = result.current.user.navigationHistory;
    expect(history.length).toBe(3);
    expect(history[0].id).toBe('room1');
    expect(history[1].id).toBe('room2');
    expect(history[2].id).toBe('room4');
  });

  it('should not add duplicate nodes to history', async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      result.current.navigateToNode('room1');
    });

    await act(async () => {
      result.current.navigateToNode('room2');
    });

    // Navigate back to room1
    await act(async () => {
      result.current.navigateToNode('room1');
    });

    await waitFor(() => {
      const history = result.current.user.navigationHistory;
      // Should still only have room1 once (but this might be expected behavior)
      const room1Count = history.filter((n) => n.id === 'room1').length;
      expect(room1Count).toBeLessThanOrEqual(1);
    });
  });

  it('should limit history to wisdom (4) nodes', async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    // Navigate through 5 nodes
    const nodes = ['room1', 'room2', 'room3', 'room6', 'room9'];
    for (const nodeId of nodes) {
      await act(async () => {
        result.current.navigateToNode(nodeId);
      });
    }

    await waitFor(() => {
      const history = result.current.user.navigationHistory;
      expect(history.length).toBeLessThanOrEqual(4);
    });

    const history = result.current.user.navigationHistory;
    expect(history.length).toBe(4);
    // Oldest should be removed
    expect(history[0].id).not.toBe('room1');
  });

  it('should navigate back and remove most recent from history', async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      result.current.navigateToNode('room1');
    });

    await act(async () => {
      result.current.navigateToNode('room2');
    });

    await waitFor(() => {
      expect(result.current.user.navigationHistory.length).toBe(2);
    });

    const historyBefore = result.current.user.navigationHistory;
    const mostRecentId = historyBefore[historyBefore.length - 1].id;

    await act(async () => {
      result.current.navigateBack();
    });

    await waitFor(() => {
      const historyAfter = result.current.user.navigationHistory;
      expect(historyAfter.length).toBe(1);
      expect(historyAfter[historyAfter.length - 1].id).not.toBe(mostRecentId);
    });
  });

  it('should update text when navigating', async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      result.current.navigateToNode('room1');
    });

    await waitFor(() => {
      expect(result.current.user.text).toContain('dimly lit chamber');
    });

    await act(async () => {
      result.current.navigateToNode('room2');
    });

    await waitFor(() => {
      expect(result.current.user.text).toContain('treasure room');
    });
  });
});

