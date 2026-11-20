import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TodoItem from '../src/components/TodoItem';
import type { Todo } from '../src/lib/types';

const todo: Todo = {
  id: 1,
  title: 'Learn DevOps',
  description: 'Practice Jenkins',
  completed: false,
  priority: 'high',
  due_date: null,
  created_at: '2026-11-20T00:00:00Z',
  updated_at: '2026-11-20T00:00:00Z'
};

describe('TodoItem', () => {
  it('renders todo details', () => {
    render(
      <TodoItem
        todo={todo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Learn DevOps')).toBeInTheDocument();
    expect(screen.getByText('Practice Jenkins')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('calls onToggle with correct ID', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDelete={vi.fn()}
      />
    );

    await user.click(screen.getByRole('checkbox'));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('calls onDelete with correct ID', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={todo}
        onToggle={vi.fn()}
        onDelete={onDelete}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Delete todo' })
    );

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});