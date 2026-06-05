// tweaks.jsx. Tweaks panel island for the registration page.
// Renders ONLY the panel; drives the page via the --accent CSS variable.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#4b9dd3"
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = [
  "#4b9dd3", // brand sky blue
  "#2f6fed", // royal blue
  "#0ea5a4", // teal
  "#7c5cff", // violet
  "#ff7a45", // warm orange
  "#16a36a"  // green
];

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);

  return (
    <TweaksPanel>
      <TweakSection label="Brand" />
      <TweakColor
        label="Accent / CTA color"
        value={t.accent}
        options={ACCENT_OPTIONS}
        onChange={(v) => setTweak('accent', v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TweaksApp />);
