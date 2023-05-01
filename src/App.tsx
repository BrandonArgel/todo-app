import * as React from "react";
import { TodoCounter, TodoList, TodoMiddle } from "@components";
import { useTodo } from "@context";
import { TodoModel } from "@models";

function App() {
	const { theme, toggleTheme, todos, addTodo } = useTodo();
	const completedTodos =
		todos.length > 0 ? todos.filter((todo: TodoModel) => todo.completed).length : 0;
	const totalTodos = todos.length;

	return (
		<>
			<div>
				<TodoCounter completedCount={completedTodos} totalCount={totalTodos} />
				<TodoMiddle placeholder="Busca una tarea" onAdd={addTodo} />
				<TodoList totalCount={totalTodos} onAdd={addTodo} />
			</div>
		</>
	);
}

export default App;
