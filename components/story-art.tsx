type StoryArtProps = {
  label: string;
  palette: [string, string];
  className?: string;
};

export function StoryArt({ label, palette, className }: StoryArtProps) {
  return (
    <div
      className={`story-art ${className ?? ""}`.trim()}
      style={{
        background: `radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 30%), linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
      }}
    >
      <div className="story-art-grid" />
      <span>{label}</span>
    </div>
  );
}
