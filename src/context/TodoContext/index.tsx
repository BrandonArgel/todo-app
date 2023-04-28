import { createContext, useContext, useEffect, useReducer } from "react";
import { useLocalStorage } from "@hooks";
import { TodoModel } from "@models";

type theme = "light" | "dark";

type ToDoState = {
	todos: TodoModel[];
	theme: theme;
	todoIdDelete: string;
};

type ToDoActions =
	| "INITIALIZE"
	| "UPDATE_TODOS"
	| "ADD_TODO"
	| "REMOVE_TODO"
	| "EDIT_TODO"
	| "TOGGLE_THEME"
	| "SET_TODO_ID_DELETE";

type ToDoAction = {
	type: ToDoActions;
	payload: any;
};

const initialState: ToDoState = {
	todos: [],
	theme: "dark",
	todoIdDelete: "",
};

const ToDoMethods = {
	updateTodos: (todos: TodoModel[]) => {},
	addTodo: (todo: TodoModel) => {},
	removeTodo: () => {},
	editTodo: (todo: TodoModel) => {},
	toggleTheme: () => {},
	setTodoIdDelete: (id: string) => {},
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
		case "SET_TODO_ID_DELETE":
			return { ...state, todoIdDelete: payload };
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
	const [theme, setTheme] = useLocalStorage("theme", "dark");
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

	const removeTodo = () => {
		const newTodos = todos.filter((todo: TodoModel) => todo.id !== state.todoIdDelete);
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

	const setTodoIdDelete = (id: string) => {
		dispatch({ type: "SET_TODO_ID_DELETE", payload: id });
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
		setTodoIdDelete,
	};

	return (
		<ToDoContext.Provider value={value}>
			<main className={`theme-${theme}`}>{children}</main>
		</ToDoContext.Provider>
	);
};

const useTodo = () => {
	const context = useContext(ToDoContext);

	if (context === undefined) {
		throw new Error("useFilters must be used within FiltersContext");
	}

	return context;
};

export { useTodo, ToDoContextProvider };
