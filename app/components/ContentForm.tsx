"use client";

import Input from "./Input";
import { useState } from "react";

type Form = {
    departure_date: Date | undefined;
    return_date: Date | undefined;
    starting_point: string;
    arrival_point: string;
    travel_type: string;
    ecological: boolean;
    mass_tourism: boolean;
    activities: string;
    steps: string;
};

const ContentForm = ({ setGptResponse }) => {
    const [form, setForm] = useState({
        departure_date: undefined,
        return_date: undefined,
        starting_point: "",
        arrival_point: "",
        travel_type: "",
        ecological: false,
        mass_tourism: false,
        activities: "",
        steps: "",
    } as Form);

    const [loading, setLoading] = useState(false);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === "checkbox") {
            setForm({ ...form, [e.target.name]: e.target.checked });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmitForm = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        const formValues = Object.keys(form).reduce((acc, key) => {
            acc[key] = form[key] ? form[key].toString() : "";
            return acc;
        }, {} as any);

        // Validation 规则
        const forbiddenWords = ["prompts", "prompt", "ignore", "sensitive", "API", "injections", "hack"];
        const requiredFields = ["arrival_point", "departure_date", "return_date", "starting_point", "travel_type"];
        const dateFields = ["departure_date", "return_date"];
        const booleanFields = ["ecological", "mass_tourism"];
        const travelTypes = ["alone", "couple", "group"];

        // 验证表单必填项是否为空或未定义
        for (const field of requiredFields) {
            if (!form[field]) {
                setLoading(false);
                alert(`${field} cannot be empty or undefined`);
                return;
            }
        }

        // 验证字段是否有超过150个字符的
        for (const key in form) {
            if (formValues[key].length > 150) {
                setLoading(false);
                alert(`The field ${key} exceeds 150 characters`);
                return;
            }
        }

        // 验证是否包含禁用词
        for (const key in form) {
            for (const word of forbiddenWords) {
                if (formValues[key].includes(word)) {
                    setLoading(false);
                    alert(`The field ${key} contains a forbidden word: ${word}`);
                    return;
                }
            }
        }

        // 验证字段 arrival_point 和 starting_point 是否为字符串
        if (typeof form.arrival_point !== "string" || typeof form.starting_point !== "string") {
            setLoading(false);
            alert(`The 'arrival_point' and 'starting_point' fields must be strings`);
            return;
        }

        // 验证字段 departure_date 和 return_date 是否为日期
        for (const field of dateFields) {
            if (!Date.parse(form[field])) {
                setLoading(false);
                alert(`The field ${field} must be a date`);
                return;
            }
        }

        for (const field of booleanFields) {
            if (typeof form[field] !== "boolean") {
                setLoading(false);
                alert(`The field ${field} must be a boolean`);
                return;
            }
        }

        if (!travelTypes.includes(form.travel_type)) {
            setLoading(false);
            alert(`The 'travel_type' field must be 'Alone', 'Couple' or 'Group'`);
            return;
        }

        try {
            if (typeof window !== "undefined") {
                const response = await window.fetch("/api/openai", {
                    method: "POST",
                    headers: new Headers({ "Content-type": "application/json" }),
                    body: JSON.stringify(formValues),
                });
                const result = await response.json();
                if (!response.ok) {
                    alert(result.error);
                    return;
                }
                setGptResponse(result.content);
            }
        } catch (err) {
            alert(err.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 mb-8">
                    <Input
                        label="Departure Date"
                        name="departure_date"
                        type="date"
                        value={form.departure_date}
                        classes="md:col-span-3"
                        onChange={(e) => handleOnChange(e)}
                    />
                    <Input
                        label="Return Date"
                        name="return_date"
                        type="date"
                        value={form.return_date}
                        classes="md:col-span-3"
                        onChange={(e) => handleOnChange(e)}
                    />
                </div>
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 mb-8">
                    <Input
                        label="Starting Point"
                        name="starting_point"
                        placeholder="Shenzhen, China"
                        value={form.starting_point}
                        classes="md:col-span-3"
                        onChange={(e) => handleOnChange(e)}
                    />
                    <Input
                        label="Destination Point"
                        name="arrival_point"
                        placeholder="Xian, China"
                        value={form.arrival_point}
                        classes="md:col-span-3"
                        onChange={(e) => handleOnChange(e)}
                    />
                </div>
                <div className="mb-8">
                    <div>
                        <label className="text-gray-600">You are traveling</label>
                        <select
                            className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 text-gray-600"
                            name="travel_type"
                            onChange={(e) => handleSelectChange(e)}>
                            <option className="text-gray-400" defaultValue="alone">
                                Choose an Option
                            </option>
                            {["Alone", "Couple", "Group"].map((option, key) => (
                                <option className="text-gray-600" value={option.toLowerCase()} key={key}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mb-8">
                    <Input
                        label="Away from mass tourism"
                        name="mass_tourism"
                        type="checkbox"
                        value={form.mass_tourism}
                        inputStyle="border ml-4 px-4 border-gray-300 rounded bg-gray-50"
                        onChange={(e) => handleOnChange(e)}
                    />
                </div>
                <div className="mb-8">
                    <Input
                        label="Activities (separated by comma)"
                        name="activities"
                        placeholder="humanities,history, hiking, climbing, sightseeing, restaurants, party"
                        value={form.activities}
                        onChange={(e) => handleOnChange(e)}
                    />
                </div>
                <div className="mb-8">
                    <Input
                        label="Preferred Stopover Locations (separated by comma)"
                        name="steps"
                        placeholder="Guangzhou,Changsha,Wuhan"
                        value={form.steps}
                        onChange={(e) => handleOnChange(e)}
                    />
                </div>
                <div className="md:col-span-5">
                    <div className="inline-flex items-end">
                        <button
                            disabled={loading}
                            className={`${
                                loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
                            } text-white font-bold py-2 px-4 rounded`}
                            onClick={(e) => handleSubmitForm(e)}>
                            {loading ? "Generating..." : "Generate"}
                        </button>
                    </div>
                    {loading && <div className="italic text-xs text-gray-500 mt-2">Please wait few seconds...</div>}
                </div>
            </div>
        </div>
    );
};

export default ContentForm;
