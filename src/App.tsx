import * as React from "react";
import { TodoCounter, TodoList, TodoMiddle } from "components";
import { Todo } from "utils/TodoType";

function App() {
	const [theme, setTheme] = React.useState(localStorage.getItem("theme") || "dark");
	const [todos, setTodos] = React.useState(
		localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos") || "[]") : []
	);
	const [search, setSearch] = React.useState("");
	const completedTodos = todos.length > 0 ? todos.filter((todo: Todo) => todo.completed).length : 0;
	const totalTodos = todos.length;

	React.useEffect(() => {
		localStorage.setItem("todos", JSON.stringify(todos));
		setTodos(todos);
	}, [todos]);

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
		localStorage.setItem("theme", theme === "light" ? "dark" : "light");
	};

	const onSearch = (val: string) => {
		setSearch(val);
	};

	const onAdd = (todo: Todo) => {
		console.log(todo);
		const newTodos = [...todos, todo];
		setTodos(newTodos);
	};

	return (
		<main className={`theme-${theme}`}>
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
					onAdd={onAdd}
				/>
				<TodoList
					search={search}
					todos={todos.filter((todo: Todo) => todo.text.toLowerCase().includes(search.toLowerCase()))}
					totalCount={totalTodos}
					setTodos={setTodos}
					onAdd={onAdd}
				/>
			</div>
		</main>
	);
}

export default App;
