import { Fragment } from "react";
import { NysDivider, NysVideo } from "@nysds/components/react";

export interface ArticleBodyBlock {
  type: "paragraph" | "heading" | "list" | "video" | "source" | "image";
  text?: string;
  items?: string[];
  videoUrl?: string;
  src?: string;
  alt?: string;
}

interface ArticleBodyProps {
  blocks: ArticleBodyBlock[];
  sourceLabel: string;
}

/**
 * Rich-text renderer over fixture body blocks (PRD §13.4): headings (with a
 * `nys-divider` between sections), paragraphs, lists, embedded YouTube via
 * `nys-video`, and a trailing "Source:" line.
 */
export function ArticleBody({ blocks, sourceLabel }: ArticleBodyProps) {
  return (
    <div className="article-body prose">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <Fragment key={index}>
                {index > 0 ? <NysDivider /> : null}
                <h2>{block.text}</h2>
              </Fragment>
            );
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "list":
            return (
              <ul key={index}>
                {block.items?.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );
          case "video":
            return (
              <div className="article-body__video" key={index}>
                <NysVideo videourl={block.videoUrl} />
              </div>
            );
          case "image":
            return (
              <img className="article-body__image" key={index} src={block.src} alt={block.alt ?? ""} />
            );
          case "source":
            return (
              <p className="article-body__source" key={index}>
                {sourceLabel}:{" "}
                <a href={block.text} target="_blank" rel="noreferrer">
                  {block.text}
                </a>
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
