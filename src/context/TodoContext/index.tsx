import { createContext, useEffect, useReducer } from "react";
import { useLocalStorage } from "@hooks";
import { TodoModel } from "@models";

type theme = "light" | "dark";

type ToDoState = {
	todos: TodoModel[];
	theme: theme;
};

type ToDoActions =
	| "INITIALIZE"
	| "UPDATE_TODOS"
	| "ADD_TODO"
	| "REMOVE_TODO"
	| "EDIT_TODO"
	| "TOGGLE_THEME";

type ToDoAction = {
	type: ToDoActions;
	payload: any;
};

const initialState: ToDoState = {
	todos: [],
	theme: "dark",
};

const ToDoMethods = {
	updateTodos: (todos: TodoModel[]) => {},
	addTodo: (todo: TodoModel) => {},
	removeTodo: (id: string) => {},
	editTodo: (todo: TodoModel) => {},
	toggleTheme: () => {},
};

const ToDoReducer = (state: ToDoState, action: ToDoAction) => {
	const { type, payload } = action;

	switch (type) {
		case "INITIALIZE":
			return { ...state, ...payload };
		case "UPDATE_TODOS":
			return { ...state, todos: payload };
		case "ADD_TODO":
			return { ...state, todos: payload };
		case "REMOVE_TODO":
			return { ...state, todos: payload };
		case "EDIT_TODO":
			return { ...state, todos: payload };
		case "TOGGLE_THEME":
			return { ...state, theme: payload };
		default:
			return state;
	}
};

const ToDoContext = createContext({
	...initialState,
	...ToDoMethods,
});

const ToDoContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(ToDoReducer, initialState);
	const [theme, setTheme] = useLocalStorage("theme", "light");
	const [todos, setTodos] = useLocalStorage("todos", []);

	const initialize = () => {
		dispatch({ type: "INITIALIZE", payload: { todos, theme } });
	};

	const updateTodos = (todos: TodoModel[]) => {
		setTodos(todos);
		dispatch({ type: "UPDATE_TODOS", payload: todos });
	};

	const addTodo = (todo: TodoModel) => {
		const newTodos = [...todos, todo];
		setTodos(newTodos);
		dispatch({ type: "ADD_TODO", payload: newTodos });
	};

	const removeTodo = (id: string) => {
		const newTodos = todos.filter((todo: TodoModel) => todo.id !== id);
		setTodos(newTodos);
		dispatch({ type: "REMOVE_TODO", payload: newTodos });
	};

	const editTodo = (todo: TodoModel) => {
		const newTodos = todos.map((t: TodoModel) => (t.id === todo.id ? todo : t));
		setTodos(newTodos);
		dispatch({ type: "EDIT_TODO", payload: newTodos });
	};

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		dispatch({ type: "TOGGLE_THEME", payload: newTheme });
	};

	useEffect(() => {
		initialize();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const value = {
		...state,
		updateTodos,
		addTodo,
		removeTodo,
		editTodo,
		toggleTheme,
	};

	return (
		<ToDoContext.Provider value={value}>
			<main className={`theme-${theme}`}>{children}</main>
		</ToDoContext.Provider>
	);
};

export { ToDoContext, ToDoContextProvider };
