/**
 * Copy text to the clipboard and report whether it actually succeeded.
 *
 * The native `navigator.clipboard` API is only available in secure contexts
 * (HTTPS / localhost). On plain-HTTP origins — common when an admin opens the
 * dashboard over a LAN IP — it is `undefined` and `writeText` throws. Callers
 * that fired a "Copied!" toast unconditionally would lie to the user. This
 * helper falls back to the legacy `execCommand("copy")` path and returns a
 * boolean so the caller can show an accurate toast.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
            // Throws/rejects in non-secure contexts (plain HTTP) — caught below
            // so we fall back to the legacy path rather than failing the copy.
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        /* fall through to the legacy path below */
    }

    try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        return ok;
    } catch {
        return false;
    }
}
