import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FilterBar from '../src/components/FilterBar';
import TodoForm from '../src/components/TodoForm';

describe('FilterBar', () => {
  it('displays filters and selects Active', async () => {
    const onFilterChange = vi.fn();
    const user = userEvent.setup();

    render(
      <FilterBar
        currentFilter="all"
        onFilterChange={onFilterChange}
        searchQuery=""
        onSearchChange={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Active' }));
    expect(onFilterChange).toHaveBeenCalledWith('active');
  });

  it('submits search query changes', async () => {
    const onSearchChange = vi.fn();
    const user = userEvent.setup();

    render(
      <FilterBar
        currentFilter="all"
        onFilterChange={vi.fn()}
        searchQuery=""
        onSearchChange={onSearchChange}
      />
    );

    await user.type(
      screen.getByPlaceholderText('Search todos...'),
      'work'
    );

    expect(onSearchChange).toHaveBeenCalled();
    expect(onSearchChange).toHaveBeenLastCalledWith('k');
  });
});

describe('TodoForm', () => {
  it('does not submit an empty title', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<TodoForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Add Todo' }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits trimmed title and selected priority', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<TodoForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Title *'), '  Task  ');
    await user.selectOptions(screen.getByLabelText('Priority'), 'high');

    await user.click(screen.getByRole('button', { name: 'Add Todo' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Task',
      description: undefined,
      priority: 'high',
      due_date: undefined
    });
  });

  it('resets the form after submit', async () => {
    const user = userEvent.setup();

    render(<TodoForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText('Title *'), 'Example');
    await user.selectOptions(screen.getByLabelText('Priority'), 'high');
    await user.click(screen.getByRole('button', { name: 'Add Todo' }));

    expect(screen.getByLabelText('Title *')).toHaveValue('');
    expect(screen.getByLabelText('Priority')).toHaveValue('medium');
  });
});