import * as React from "react";
import { TodoCounter, TodoList, TodoMiddle } from "@components";
import { useTodo } from "@context";
import { TodoModel } from "@models";

function App() {
	const { theme, toggleTheme, todos, addTodo, updateTodos } = useTodo();
	const [search, setSearch] = React.useState("");
	const completedTodos =
		todos.length > 0 ? todos.filter((todo: TodoModel) => todo.completed).length : 0;
	const totalTodos = todos.length;

	const onSearch = (val: string) => {
		setSearch(val);
	};

	return (
		<>
			<div>
				<TodoCounter
					completedCount={completedTodos}
					totalCount={totalTodos}
					theme={theme}
					setTheme={toggleTheme}
				/>
				<TodoMiddle
					onSearch={onSearch}
					placeholder="Busca una tarea"
					value={search}
					onAdd={addTodo}
				/>
				<TodoList
					search={search}
					todos={todos.filter((todo: TodoModel) =>
						todo.text.toLowerCase().includes(search.toLowerCase())
					)}
					totalCount={totalTodos}
					setTodos={updateTodos}
					onAdd={addTodo}
				/>
			</div>
		</>
	);
}

export default App;
