import * as React from "react";
import styles from "./Checkbox.module.scss";

interface Props {
	checked: boolean;
	children: React.ReactNode;
	onChange: any;
}

export const Checkbox: React.FC<Props> = ({ checked, children, onChange }) => {
	return (
		<div className={styles.checkbox}>
			<input type="checkbox" checked={checked} tabIndex={-1} onChange={onChange} />
			<button
				className={styles.checkbox_checkmark}
				onClick={onChange}
				title="Marcar como completada"
				type="button"
			/>
			<p>{children}</p>
		</div>
	);
};
