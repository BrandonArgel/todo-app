import * as React from "react";
import { Checkbox } from "components";
import { Close } from "assets/icons";
import { Todo } from "utils/TodoType";
import styles from "./TodoModal.module.scss";

interface Props {
	open: boolean;
	onClose: () => void;
	onAdd: (todo: Todo) => void;
}

export const TodoModal = ({ open, onClose, onAdd }: Props) => {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [text, setText] = React.useState({
		value: "",
		error: false,
	});
	const [completed, setCompleted] = React.useState(false);

	React.useEffect(() => {
		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}, 0);
	}, [open]);

	const validate = (value: string) => {
		if (!value) {
			inputRef.current!.focus();
			return setText({
				value,
				error: true,
			});
		}

		return true;
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (validate(text.value)) {
			const todo = {
				id: new Date().getTime().toString(),
				text: text.value,
				completed,
			};
			onAdd(todo);
			setText({
				value: "",
				error: false,
			});
			setCompleted(false);
			onClose();
		}
	};

	return (
		<>
			<button
				aria-hidden={!open}
				className={`${styles.overlay} ${open ? styles.visible : ""}`}
				onClick={() => onClose()}
				tabIndex={-1}
				type="button"
			/>
			<aside
				className={`${styles.modal} ${open ? styles.open : ""}`}
				aria-hidden={!open}
				tabIndex={0}
			>
				<form className={styles.modal__form} onSubmit={onSubmit}>
					<label className={`${styles.modal__form_label} ${text.error ? styles.error : ""}`}>
						Agregar una tarea:
						<input
							ref={inputRef}
							type="text"
							placeholder="Aprender, estudiar, hacer, ..."
							value={text.value}
							onChange={(e) => setText({ value: e.target.value, error: false })}
							title="Agrega una tarea"
						/>
					</label>
					<label className={styles.modal__form_checkbox}>
						Completada:
						<Checkbox checked={completed} onChange={() => setCompleted(!completed)}>
							{text.value || "Todo"}
						</Checkbox>
					</label>
					<div className={styles.modal__form_buttons}>
						<button type="button" onClick={() => onClose()}>
							Cancel
						</button>
						<button type="submit">Agregar</button>
					</div>
				</form>
				<button
					type="button"
					className={styles.close}
					onClick={() => onClose()}
					aria-label="Cerrar modal"
				>
					<Close />
				</button>
			</aside>
		</>
	);
};
