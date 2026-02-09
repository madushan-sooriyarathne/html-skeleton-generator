export interface ElementInfo {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  className?: string;
}

export interface SkeletonGeneratorResult {
  elements: ElementInfo[];
  html: string;
  error?: string;
}

export function generateSkeletonCode(elements: ElementInfo[]): string {
  if (elements.length === 0) {
    return `import { Skeleton } from "~/components/ui/skeleton";\n\nexport default function LoadingSkeleton() {\n  return (\n    <div className="p-4">\n      <p className="text-muted-foreground">No elements detected</p>\n    </div>\n  );\n}`;
  }

  // Group elements by vertical position (with tolerance)
  const rows: ElementInfo[][] = [];
  const tolerance = 10;

  elements.forEach((element) => {
    let foundRow = false;
    for (const row of rows) {
      if (Math.abs(row[0]!.y - element.y) < tolerance) {
        row.push(element);
        foundRow = true;
        break;
      }
    }
    if (!foundRow) {
      rows.push([element]);
    }
  });

  // Sort rows by Y position
  rows.sort((a, b) => a[0]!.y - b[0]!.y);

  // Sort elements within each row by X position
  rows.forEach((row) => {
    row.sort((a, b) => a.x - b.x);
  });

  // Generate JSX
  const skeletonElements = rows
    .map((row) => {
      if (row.length === 1) {
        const el = row[0]!;
        return generateSingleElement(el);
      } else {
        // Multiple elements in a row - use flex
        const rowElements = row.map((el) => generateSingleElement(el)).join("\n        ");
        return `      <div className="flex items-center gap-4">\n        ${rowElements}\n      </div>`;
      }
    })
    .join("\n");

  return `import { Skeleton } from "~/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
${skeletonElements}
    </div>
  );
}`;
}

function generateSingleElement(el: ElementInfo): string {
  const heightClass = getHeightClass(el.height);
  const widthClass = getWidthClass(el.width);
  
  let className = "Skeleton";
  if (el.type === "circle" || el.type === "avatar") {
    className = `Skeleton className="rounded-full ${heightClass} ${widthClass}"`;
  } else if (el.type === "button") {
    className = `Skeleton className="rounded-md ${heightClass} ${widthClass}"`;
  } else {
    className = `Skeleton className="${heightClass} ${widthClass}"`;
  }

  return `<${className} />`;
}

function getHeightClass(height: number): string {
  if (height <= 20) return "h-4";
  if (height <= 32) return "h-6";
  if (height <= 40) return "h-8";
  if (height <= 48) return "h-10";
  if (height <= 64) return "h-12";
  if (height <= 96) return "h-16";
  if (height <= 128) return "h-24";
  return "h-32";
}

function getWidthClass(width: number): string {
  if (width <= 32) return "w-8";
  if (width <= 48) return "w-12";
  if (width <= 64) return "w-16";
  if (width <= 96) return "w-24";
  if (width <= 128) return "w-32";
  if (width <= 192) return "w-48";
  if (width <= 256) return "w-64";
  if (width <= 384) return "w-96";
  return "w-full";
}

export async function analyzeHTML(html: string): Promise<SkeletonGeneratorResult> {
  try {
    // Create an iframe to render the HTML
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.style.width = "800px";
    iframe.style.height = "600px";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error("Cannot access iframe document");
    }

    // Write HTML with Tailwind CDN
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 16px; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);
    iframeDoc.close();

    // Wait for content to load
    await new Promise((resolve) => {
      if (iframe.contentWindow) {
        iframe.contentWindow.addEventListener("load", resolve);
      } else {
        setTimeout(resolve, 500);
      }
    });

    // Give Tailwind time to apply styles
    await new Promise((resolve) => setTimeout(resolve, 300));

    const elements: ElementInfo[] = [];

    // Traverse the DOM and collect element info
    function traverseElement(element: Element) {
      // Skip script, style, head elements
      if (
        element.tagName === "SCRIPT" ||
        element.tagName === "STYLE" ||
        element.tagName === "HEAD"
      ) {
        return;
      }

      const rect = element.getBoundingClientRect();

      // Only process visible elements with size
      if (rect.width > 5 && rect.height > 5) {
        const tagName = element.tagName.toLowerCase();
        
        // Detect leaf elements (elements with meaningful content)
        const hasTextContent = 
          element.childNodes.length > 0 &&
          Array.from(element.childNodes).some(
            (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
          );

        const isLeafElement =
          tagName === "img" ||
          tagName === "button" ||
          tagName === "input" ||
          tagName === "textarea" ||
          tagName === "a" ||
          (hasTextContent && element.children.length === 0);

        if (isLeafElement) {
          const computedStyle = iframe.contentWindow?.getComputedStyle(element);
          const isCircle =
            computedStyle?.borderRadius &&
            parseFloat(computedStyle.borderRadius) >= Math.min(rect.width, rect.height) / 2;

          elements.push({
            type: isCircle ? "circle" : tagName === "img" ? "avatar" : tagName,
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            className: element.className,
          });
        }

        // Recursively traverse children
        Array.from(element.children).forEach(traverseElement);
      }
    }

    const body = iframeDoc.body;
    if (body) {
      Array.from(body.children).forEach(traverseElement);
    }

    // Clean up
    document.body.removeChild(iframe);

    return {
      elements,
      html,
    };
  } catch (error) {
    return {
      elements: [],
      html,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
