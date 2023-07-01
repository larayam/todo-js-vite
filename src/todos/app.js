import html from './app.html?raw';
import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, renderPending } from './use-cases';

const elementIDs = {
  ClearCompletedButton: '.clear-completed',
  TodoList: '.todo-list',
  NewTodoInput: '#new-todo-input',
  Todofilters: '.filtro',
  PendingCountLabel: '#pending-count',
}

/**
 * 
 * @param {String} elementId
 */

export const App = (elementId) => {

  const displeyTodos = () => {
    const todos = todoStore.getTodos(todoStore.getCurrentFilter());
    renderTodos(elementIDs.TodoList, todos);
    updatePendingcount();

  }

  const updatePendingcount = () => {
    renderPending(elementIDs.PendingCountLabel);
  }

  // cuando la función App() se llama
  (() => {
    const app = document.createElement('div');
    app.innerHTML = html;
    document.querySelector(elementId).append(app);
    displeyTodos();

  })();

  // Referencias HTML
  const newDescriptionInput = document.querySelector(elementIDs.NewTodoInput);
  const todoListUL = document.querySelector(elementIDs.TodoList);
  const clearCompletedButton = document.querySelector(elementIDs.ClearCompletedButton);
  const filtersLIs = document.querySelectorAll(elementIDs.Todofilters);

  // Listeners
  newDescriptionInput.addEventListener('keyup', (event) => {
    if (event.keyCode !== 13) return;
    if (event.target.value.trim().length === 0) return;

    todoStore.addTodo(event.target.value);
    displeyTodos();
    event.target.value = '';

  });

  todoListUL.addEventListener('click', (event) => {
    const element = event.target.closest('[data-id]');
    todoStore.toggleTodo(element.getAttribute('data-id'));
    displeyTodos();
  });

  todoListUL.addEventListener('click', (event) => {
    const isDestroyelement = event.target.className === 'destroy';
    const element = event.target.closest('[data-id]');
    if (!element || !isDestroyelement) return;
    todoStore.deleteTodo(element.getAttribute('data-id'));
    displeyTodos();

  });

  clearCompletedButton.addEventListener('click', () => {

    todoStore.deleteCompleted();
    displeyTodos();
  });

  filtersLIs.forEach(element => {

    element.addEventListener('click', (element) => {
      filtersLIs.forEach(el => el.classList.remove('selected'));
      element.target.classList.add('selected');

      switch (element.target.text) {
        case 'Todos':
          todoStore.setFilter(Filters.All);
          break;

        case 'Pendientes':
          todoStore.setFilter(Filters.Panding);
          break;

        case 'Completados':
          todoStore.setFilter(Filters.Completed);
          break;
      }
      displeyTodos();
    })
  })



}