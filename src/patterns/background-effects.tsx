export function BackgroundEffects() {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none select-none overflow-hidden bg-(--bg-base)">
            <div
                className="absolute inset-0 h-full w-full"
                style={{
                    backgroundImage: `radial-gradient(var(--text-secondary) 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                    opacity: 0.12,
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
                }}
            />
        </div>
    );
}
