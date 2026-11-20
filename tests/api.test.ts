import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn()
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mocks)
  }
}));

import { todoApi } from '../src/lib/api';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('Todo API Client', () => {

  it('GET all todos with filters', async () => {
    const todos = [{ id: 1, title: 'Learn DevOps' }];

    mocks.get.mockResolvedValue({ data: todos });

    const result = await todoApi.getAllTodos({
      completed: false,
      priority: 'high',
      search: 'learn devops'
    });

    expect(mocks.get).toHaveBeenCalledWith(
      '/todos?completed=false&priority=high&search=learn+devops'
    );

    expect(result).toEqual(todos);
  });

  it('GET all todos without filters', async () => {
    mocks.get.mockResolvedValue({ data: [] });

    const result = await todoApi.getAllTodos();

    expect(mocks.get).toHaveBeenCalledWith('/todos?');
    expect(result).toEqual([]);
  });

  it('GET todo by ID', async () => {
    const todo = { id: 5, title: 'Task 5' };

    mocks.get.mockResolvedValue({ data: todo });

    const result = await todoApi.getTodoById(5);

    expect(mocks.get).toHaveBeenCalledWith('/todos/5');
    expect(result).toEqual(todo);
  });

  it('POST creates a todo', async () => {
    const input = {
      title: 'New Task',
      priority: 'high' as const
    };

    const created = { id: 10, ...input };

    mocks.post.mockResolvedValue({ data: created });

    const result = await todoApi.createTodo(input);

    expect(mocks.post).toHaveBeenCalledWith(
      '/todos',
      input
    );

    expect(result).toEqual(created);
  });

  it('PUT updates a todo', async () => {
    const updates = { title: 'Updated Task' };
    const updated = { id: 10, ...updates };

    mocks.put.mockResolvedValue({ data: updated });

    const result = await todoApi.updateTodo(10, updates);

    expect(mocks.put).toHaveBeenCalledWith(
      '/todos/10',
      updates
    );

    expect(result).toEqual(updated);
  });

  it('PATCH toggles todo completion', async () => {
    const updated = { id: 10, completed: true };

    mocks.patch.mockResolvedValue({ data: updated });

    const result = await todoApi.toggleTodo(10);

    expect(mocks.patch).toHaveBeenCalledWith(
      '/todos/10/toggle'
    );

    expect(result).toEqual(updated);
  });

  it('DELETE removes a todo', async () => {
    mocks.delete.mockResolvedValue({});

    await todoApi.deleteTodo(10);

    expect(mocks.delete).toHaveBeenCalledWith(
      '/todos/10'
    );
  });

});