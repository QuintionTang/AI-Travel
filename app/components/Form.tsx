"use client";

import ContentForm from "./ContentForm";
import HeaderForm from "./HeaderForm";
import { useEffect, useRef, useState } from "react";
import Markdown from "markdown-to-jsx";
import MapComponent from "./MapComponent";

const Form = () => {
    const [gptResponse, setGptResponse] = useState("");
    const [leafletPoints, setLeafletPoints] = useState([]);
    const gptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!gptResponse?.length) return;
        if (typeof window !== "undefined") {
            gptRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [gptResponse]);

    useEffect(() => {
        if (!gptResponse?.length) return;
        const pattern = /!!(.*?)!!/g;
        const matches = gptResponse.match(pattern);
        if (matches) {
            setLeafletPoints(
                matches.map((match) => {
                    let coords = match
                        .replace(/!!/g, "")
                        .split(",")
                        .map((coord) => parseFloat(coord.trim()));
                    return coords;
                })
            );
        }
    }, [gptResponse]);

    const resetForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setGptResponse("");
    };

    const exportInTextFile = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const element = document.createElement("a");
        const file = new Blob([gptResponse], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "travel-tour.txt";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div>
            <div className="form-box rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-1">
                    <HeaderForm />
                    <ContentForm setGptResponse={setGptResponse} />
                </div>
            </div>
            <div ref={gptRef} id="gptResponse">
                {gptResponse?.length ? (
                    <div className="travel-plan-box">
                        <h2 className="text-2xl font-bold mb-4">Generated Travel</h2>
                        <MapComponent points={leafletPoints} />
                        <Markdown>{gptResponse}</Markdown>
                    </div>
                ) : null}
            </div>
            {gptResponse?.length ? (
                <div className="travel-action">
                    <div className="flex mt-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                            onClick={(e) => exportInTextFile(e)}>
                            Export
                        </button>
                        <button
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                            onClick={(e) => resetForm(e)}>
                            Reset
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Form;
