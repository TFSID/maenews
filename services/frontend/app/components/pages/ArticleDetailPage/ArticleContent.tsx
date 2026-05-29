interface ArticleContentProps {
  htmlContent: string;
}

export function ArticleContent({ htmlContent }: ArticleContentProps) {
  return (
    <div
      className="prose prose-base max-w-none
        prose-headings:font-bold prose-headings:text-[#090909] prose-headings:text-lg prose-headings:mt-6 prose-headings:mb-3
        prose-p:text-[#4A4A4A] prose-p:leading-relaxed prose-p:text-sm prose-p:mb-4
        prose-strong:font-bold
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}