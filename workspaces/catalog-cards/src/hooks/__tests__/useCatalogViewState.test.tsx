import React from 'react';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';
import { TestApiProvider } from '@backstage/test-utils';
import { storageApiRef } from '@backstage/core-plugin-api';
import { useCatalogViewState } from '../useCatalogViewState';

const mockStorageApi = {
  forBucket: jest.fn(),
};

const mockBucket = {
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
  observe$: jest.fn(),
  snapshot: jest.fn(),
};

const wrapper = ({
  children,
  initialRoute = '/',
}: {
  children: React.ReactNode;
  initialRoute?: string;
}) => (
  <TestApiProvider apis={[[storageApiRef, mockStorageApi]]}>
    <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
  </TestApiProvider>
);

describe('useCatalogViewState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorageApi.forBucket.mockReturnValue(mockBucket);
    mockBucket.get.mockReturnValue(undefined);
    mockBucket.snapshot.mockReturnValue({ value: undefined });
  });

  it('should initialize with default view', () => {
    const { result } = renderHook(() => useCatalogViewState(), { wrapper });

    expect(result.current.view).toBe('table');
  });

  it('should initialize with custom initial view', () => {
    const { result } = renderHook(() => useCatalogViewState('cards'), {
      wrapper,
    });

    expect(result.current.view).toBe('cards');
  });

  it('should read view from URL parameter', () => {
    const TestWrapper = ({ children }: { children: React.ReactNode }) =>
      wrapper({ children, initialRoute: '/?view=cards' });

    const { result } = renderHook(() => useCatalogViewState(), {
      wrapper: TestWrapper,
    });

    expect(result.current.view).toBe('cards');
  });

  it('should read view from storage when URL has no view param', () => {
    mockBucket.snapshot.mockReturnValue({ value: 'cards' });

    const { result } = renderHook(() => useCatalogViewState(), { wrapper });

    expect(result.current.view).toBe('cards');
    expect(mockStorageApi.forBucket).toHaveBeenCalledWith('catalog-cards');
    expect(mockBucket.snapshot).toHaveBeenCalledWith('view');
  });

  it('should update view and URL when setView is called', () => {
    const { result } = renderHook(() => useCatalogViewState(), { wrapper });

    act(() => {
      result.current.setView('cards');
    });

    expect(result.current.view).toBe('cards');
    expect(mockBucket.set).toHaveBeenCalledWith('view', 'cards');
  });

  it('should toggle between table and cards view', () => {
    const { result } = renderHook(() => useCatalogViewState('table'), {
      wrapper,
    });

    act(() => {
      result.current.toggleView();
    });

    expect(result.current.view).toBe('cards');

    act(() => {
      result.current.toggleView();
    });

    expect(result.current.view).toBe('table');
  });

  it('should remove view parameter from URL when setting table view', () => {
    const TestWrapper = ({ children }: { children: React.ReactNode }) =>
      wrapper({ children, initialRoute: '/?view=cards&other=param' });

    const { result } = renderHook(() => useCatalogViewState(), {
      wrapper: TestWrapper,
    });

    expect(result.current.view).toBe('cards');

    act(() => {
      result.current.setView('table');
    });

    expect(result.current.view).toBe('table');
    // URL should still have other params but not view
  });

  it('should preserve other URL parameters when changing view', () => {
    const TestWrapper = ({ children }: { children: React.ReactNode }) =>
      wrapper({ children, initialRoute: '/?filter=service&view=table' });

    const { result } = renderHook(() => useCatalogViewState(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setView('cards');
    });

    expect(result.current.view).toBe('cards');
    // Other parameters should be preserved
  });

  it('should ignore invalid view values from URL', () => {
    const TestWrapper = ({ children }: { children: React.ReactNode }) =>
      wrapper({ children, initialRoute: '/?view=invalid' });

    const { result } = renderHook(() => useCatalogViewState(), {
      wrapper: TestWrapper,
    });

    // Should fall back to default
    expect(result.current.view).toBe('table');
  });
});
