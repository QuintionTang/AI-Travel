"use client";

const Input = ({
    label,
    name,
    placeholder = "",
    type = "text",
    value = "",
    classes = "",
    inputStyle = "h-10 border mt-1 rounded px-4 w-full bg-gray-50 text-gray-600",
    onChange = () => {},
}: {
    label: string;
    name: string;
    placeholder?: string;
    type?: string;
    value?: string | Date | boolean;
    classes?: string;
    inputStyle?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    let inputValue: string | undefined;
    let isChecked: boolean | undefined;

    if (typeof value === "boolean") {
        isChecked = value;
    } else if (typeof value === "string") {
        inputValue = value;
    } else if (value instanceof Date) {
        inputValue = value.toISOString().split("T")[0];
    }

    return (
        <div className={classes}>
            <label htmlFor={name} className="text-gray-600">
                {label}
            </label>
            <input
                type={type}
                name={name}
                id={name}
                className={inputStyle}
                value={type === "checkbox" ? undefined : inputValue}
                checked={type === "checkbox" ? isChecked : undefined}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
};

export default Input;
