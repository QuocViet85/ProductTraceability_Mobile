export function handleInputNumber(text: string | undefined, setInput: Function) {
    if (text?.trim() === '') {
        text = undefined;
    }else if (text && isNaN(text as any)) {
        text = text.replace(/\D+/g, '');
    }

    setInput(text);
}