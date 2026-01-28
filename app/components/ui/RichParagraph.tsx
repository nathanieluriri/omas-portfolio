interface RichParagraphProps {
  paragraphs: string[];
}

export default function RichParagraph({ paragraphs }: RichParagraphProps) {
  return (
    <div className="space-y-6 text-[15.5px] leading-7 text-[var(--text-secondary)] md:text-[16.5px]">
      {paragraphs.map((text, index) => (
        <p
          key={text}
          className={index === 0 ? "" : ""}
        >
          {text}
        </p>
      ))}
    </div>
  );
}
