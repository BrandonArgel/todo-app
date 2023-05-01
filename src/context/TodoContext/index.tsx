import { createContext, useContext, useEffect, useReducer } from "react";
import { useLocalStorage } from "@hooks";
import { TodoModel } from "@models";

type theme = "light" | "dark";

type ToDoState = {
	search: string;
	todos: TodoModel[];
	theme: theme;
	todoIdDelete: string;
	setLocalStorageTodos: (todos: TodoModel[]) => void;
};

type ToDoActions =
	| "ADD_TODO"
	| "EDIT_TODO"
	| "INITIALIZE"
	| "REMOVE_TODO"
	| "SET_SEARCH"
	| "SET_TODO_ID_DELETE"
	| "TOGGLE_THEME"
	| "UPDATE_TODOS";

type ToDoAction = {
	type: ToDoActions;
	payload: any;
};

const initialState: ToDoState = {
	search: "",
	todos: [],
	theme: "dark",
	todoIdDelete: "",
	setLocalStorageTodos: () => {},
};

const ToDoMethods = {
	updateTodos: (todos: TodoModel[]) => {},
	addTodo: (todo: TodoModel) => {},
	removeTodo: () => {},
	editTodo: (todo: TodoModel) => {},
	toggleTheme: () => {},
	setTodoIdDelete: (id: string) => {},
	setSearch: (search: string) => {},
};

const ToDoReducer = (state: ToDoState, action: ToDoAction) => {
	const { type, payload } = action;

	switch (type) {
		case "INITIALIZE":
			return { ...state, ...payload };
		case "UPDATE_TODOS":
			state.setLocalStorageTodos(payload);
			return { ...state, todos: payload };
		case "ADD_TODO":
			const newAddTodos = [...state.todos, payload];
			state.setLocalStorageTodos(newAddTodos);
			return { ...state, todos: newAddTodos };
		case "REMOVE_TODO":
			const newRemoveTodos = state.todos.filter(
				(todo: TodoModel) => todo.id !== state.todoIdDelete
			);
			state.setLocalStorageTodos(newRemoveTodos);
			return { ...state, todos: newRemoveTodos };
		case "EDIT_TODO":
			const newEditTodos = state.todos.map((todo: TodoModel) => {
				if (todo.id === payload.id) {
					return payload;
				}
				return todo;
			});
			state.setLocalStorageTodos(newEditTodos);
			return { ...state, todos: newEditTodos };
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
	const [localStorageTodos, setLocalStorageTodos] = useLocalStorage("todos", []);
	const [state, dispatch] = useReducer(ToDoReducer, initialState);
	const [theme, setTheme] = useLocalStorage("theme", "dark");

	const initialize = () => {
		dispatch({
			type: "INITIALIZE",
			payload: { todos: localStorageTodos, setLocalStorageTodos, theme },
		});
	};

	const updateTodos = (newTodos: TodoModel[]) => {
		dispatch({ type: "UPDATE_TODOS", payload: newTodos });
	};

	const addTodo = (todo: TodoModel) => {
		dispatch({ type: "ADD_TODO", payload: todo });
	};

	const removeTodo = () => {
		dispatch({ type: "REMOVE_TODO", payload: null });
	};

	const editTodo = (todo: TodoModel) => {
		dispatch({ type: "EDIT_TODO", payload: todo });
	};

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		dispatch({ type: "TOGGLE_THEME", payload: newTheme });
	};

	const setTodoIdDelete = (id: string) => {
		dispatch({ type: "SET_TODO_ID_DELETE", payload: id });
	};

	const setSearch = (search: string) => {
		dispatch({ type: "SET_SEARCH", payload: search });
	};

	useEffect(() => {
		initialize();

		const onChange = (change: StorageEvent) => {
			if (change.key === "todos") {
				const newTodos = JSON.parse(change.newValue || "[]");
				dispatch({ type: "UPDATE_TODOS", payload: newTodos });
			}
		};

		window.addEventListener("storage", onChange);

		return () => {
			window.removeEventListener("storage", onChange);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const value = {
		...state,
		updateTodos,
		addTodo,
		removeTodo,
		editTodo,
		toggleTheme,
		setTodoIdDelete,
		setSearch,
		todos: state.todos.filter((todo: TodoModel) =>
			todo.text.toLowerCase().includes(state.search.toLowerCase())
		),
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
