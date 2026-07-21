import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Combobox } from "../primitives";

const options = [
    { value: "qwen", label: "Qwen Embedding", iconUrl: "/qwen.svg" },
    { value: "gemini", label: "Gemini Embedding", iconUrl: "/google.svg" },
];

describe("Combobox visual state", () => {
    it("restores the committed label when filtering is cancelled", () => {
        render(<Combobox options={options} value="qwen" onChange={() => {}} allowCustom={false} />);
        const input = screen.getByRole("combobox");

        fireEvent.change(input, { target: { value: "Gemini" } });
        fireEvent.keyDown(input, { key: "Escape" });
        expect(input).toHaveValue("Qwen Embedding");

        fireEvent.change(input, { target: { value: "Gemini" } });
        fireEvent.mouseDown(document.body);
        expect(input).toHaveValue("Qwen Embedding");
    });

    it("commits the display label immediately even when the controlled value is unchanged", () => {
        render(<Combobox options={options} value="qwen" onChange={() => {}} allowCustom={false} />);
        const input = screen.getByRole("combobox");

        fireEvent.change(input, { target: { value: "Qwen" } });
        fireEvent.click(screen.getByRole("option", { name: "Qwen Embedding" }));
        expect(input).toHaveValue("Qwen Embedding");
    });

    it("hides the committed option icon while the user filters for another option", () => {
        const { container } = render(
            <Combobox options={options} value="qwen" onChange={() => {}} allowCustom={false} />,
        );
        const input = screen.getByRole("combobox");

        expect(container.querySelector('img[src="/qwen.svg"]')).toBeInTheDocument();
        fireEvent.change(input, { target: { value: "Gemini" } });

        expect(container.querySelector('img[src="/qwen.svg"]')).toBeNull();
        expect(screen.getByRole("option", { name: "Gemini Embedding" })).toBeInTheDocument();
    });

    it("uses a near-opaque popover surface so underlying form text does not bleed through", () => {
        render(<Combobox options={options} value="qwen" onChange={() => {}} allowCustom={false} />);
        fireEvent.focus(screen.getByRole("combobox"));

        expect(screen.getByRole("listbox").parentElement).toHaveClass("bg-popover/95");
    });
});
