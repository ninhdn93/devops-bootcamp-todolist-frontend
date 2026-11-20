import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mocks = vi.hoisted(() => ({
  getAllTodos: vi.fn(),
  createTodo: vi.fn(),
  toggleTodo: vi.fn(),
  deleteTodo: vi.fn()
}));

vi.mock('@/lib/api', () => ({
  todoApi: mocks
}));

import Home from '../src/app/page';

let client: QueryClient;

function renderPage() {
  client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      },
      mutations: {
        retry: false
      }
    }
  });

  return render(
    <QueryClientProvider client={client}>
      <Home />
    </QueryClientProvider>
  );
}

describe('Home Page - React Query', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    client?.clear();
  });

  it('shows loading state while fetching todos', async () => {
    let resolveRequest!: (value: unknown[]) => void;

    mocks.getAllTodos.mockImplementation(
      () => new Promise(resolve => {
        resolveRequest = resolve;
      })
    );

    renderPage();

    expect(
      screen.getByText('Loading todos...')
    ).toBeInTheDocument();

    resolveRequest([]);
  });

  it('shows empty state when no todos exist', async () => {
    mocks.getAllTodos.mockResolvedValue([]);

    renderPage();

    expect(
      await screen.findByText('No todos found')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Create one to get started!')
    ).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    mocks.getAllTodos.mockRejectedValue(
      new Error('Simulated API failure')
    );

    renderPage();

    expect(
      await screen.findByText('Error loading todos')
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Please make sure the backend server is running.'
      )
    ).toBeInTheDocument();
  });
});