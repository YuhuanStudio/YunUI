"use client";

import { useState } from "react";
import { YunUIProvider } from "yunui/adapters";
import { ModelIcon, ProviderIcon } from "yunui/ai";

function BrokenFixtureImage({
  src,
  alt,
  width,
  height,
  className,
  onError,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onError?: () => void;
}) {
  return <img data-icon-source={src} src={src} alt={alt} width={width} height={height} className={className} onError={onError} />;
}

/** Browser-only host fixture: every icon URL deliberately 404s so prop changes
 * exercise the real public components' error/fallback state transitions. */
export default function IconErrorResetFixture() {
  const [provider, setProvider] = useState("openai");
  const [providerUrl, setProviderUrl] = useState("/__icon-fixture/provider-openai-ok.svg");
  const [modelUrl, setModelUrl] = useState("/__icon-fixture/model-openai-ok.svg");
  const [modelDeveloper, setModelDeveloper] = useState("openai");
  const [modelProvider, setModelProvider] = useState("openai");

  return (
    <YunUIProvider adapters={{ Image: BrokenFixtureImage, iconBasePath: "/__icon-fixture/icons" }}>
      <main data-testid="icon-error-reset-root" className="mx-auto max-w-2xl space-y-6 p-6 text-left">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Research browser fixture · no production styling changes</p>
          <h1 className="text-xl font-semibold">Icon source change after error</h1>
          <p className="text-sm text-muted-foreground">All configured image requests intentionally fail. The buttons change the public component props.</p>
        </header>
        <section data-testid="provider-icon-case" className="flex items-center gap-4 rounded-lg border border-border p-4">
          <ProviderIcon provider={provider} iconUrl={providerUrl} size={40} />
          <div className="min-w-0 flex-1">
            <h2 className="font-medium">ProviderIcon</h2>
            <p data-testid="provider-current" className="truncate text-xs text-muted-foreground">{provider} · {providerUrl}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn btn-secondary shrink-0" onClick={() => setProviderUrl("/__icon-fixture/provider-openai-failed.png")}>Fail current provider URL</button>
              <button type="button" className="btn btn-secondary shrink-0" onClick={() => { setProvider("anthropic"); setProviderUrl("/__icon-fixture/provider-anthropic-ok.svg"); }}>Switch provider and valid URL</button>
            </div>
          </div>
        </section>
        <section data-testid="model-icon-case" className="flex items-center gap-4 rounded-lg border border-border p-4">
          <ModelIcon provider={modelProvider} developer={modelDeveloper} iconUrl={modelUrl} size={40} />
          <div className="min-w-0 flex-1">
            <h2 className="font-medium">ModelIcon</h2>
            <p data-testid="model-current" className="truncate text-xs text-muted-foreground">{modelProvider} / {modelDeveloper} · {modelUrl}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn btn-secondary shrink-0" onClick={() => setModelUrl("/__icon-fixture/model-openai-failed.png")}>Fail current model URL</button>
              <button type="button" className="btn btn-secondary shrink-0" onClick={() => { setModelProvider("anthropic"); setModelDeveloper("anthropic"); setModelUrl("/__icon-fixture/model-anthropic-ok.svg"); }}>Switch model source to valid icon</button>
            </div>
          </div>
        </section>
      </main>
    </YunUIProvider>
  );
}
