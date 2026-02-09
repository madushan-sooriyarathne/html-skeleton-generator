"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { analyzeHTML, generateSkeletonCode } from "~/lib/skeleton-generator";
import type { ElementInfo } from "~/lib/skeleton-generator";
import { Skeleton } from "~/components/ui/skeleton";

const SAMPLE_HTML = `<div class="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6">
  <div class="flex items-center space-x-4">
    <img src="https://via.placeholder.com/64" alt="Avatar" class="w-16 h-16 rounded-full" />
    <div>
      <h2 class="text-xl font-bold text-gray-900">John Doe</h2>
      <p class="text-gray-600">Software Engineer</p>
    </div>
  </div>
  <p class="mt-4 text-gray-700">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </p>
  <button class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
    View Profile
  </button>
</div>`;

export default function HomePage() {
  const [inputHtml, setInputHtml] = useState(SAMPLE_HTML);
  const [generatedCode, setGeneratedCode] = useState("");
  const [elements, setElements] = useState<ElementInfo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!inputHtml.trim()) {
      setError("Please enter some HTML to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setCopied(false);

    try {
      const result = await analyzeHTML(inputHtml);
      
      if (result.error) {
        setError(result.error);
        setElements([]);
        setGeneratedCode("");
      } else {
        setElements(result.elements);
        const code = generateSkeletonCode(result.elements);
        setGeneratedCode(code);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze HTML");
      setElements([]);
      setGeneratedCode("");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedCode) return;
    
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleLoadSample = () => {
    setInputHtml(SAMPLE_HTML);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            HTML to Skeleton Generator
          </h1>
          <p className="text-lg text-gray-600">
            Paste your HTML and generate loading skeleton components instantly
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Panel - Input */}
          <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">HTML Input</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSample}
              >
                Load Sample
              </Button>
            </div>

            <Textarea
              value={inputHtml}
              onChange={(e) => setInputHtml(e.target.value)}
              placeholder="Paste your HTML here..."
              className="font-mono text-sm flex-1 min-h-[400px]"
            />

            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputHtml.trim()}
                className="flex-1"
              >
                {isAnalyzing ? "Analyzing..." : "Generate Skeleton"}
              </Button>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          {/* Right Panel - Output */}
          <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Generated Skeleton
              </h2>
              {generatedCode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                >
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              )}
            </div>

            {/* Preview */}
            {elements.length > 0 && (
              <div className="mb-4 rounded-md border bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Preview:</h3>
                <div className="rounded-md bg-white p-4">
                  <SkeletonPreview elements={elements} />
                </div>
              </div>
            )}

            {/* Code Output */}
            <div className="flex-1">
              {generatedCode ? (
                <pre className="h-full overflow-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{generatedCode}</code>
                </pre>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  {isAnalyzing ? (
                    <div className="text-center">
                      <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
                      <p>Analyzing HTML...</p>
                    </div>
                  ) : (
                    <p>Generated skeleton code will appear here</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        {elements.length > 0 && (
          <div className="mt-6 rounded-lg border bg-white p-4 text-center">
            <p className="text-sm text-gray-600">
              Detected <strong>{elements.length}</strong> element
              {elements.length !== 1 ? "s" : ""} •{" "}
              <span className="text-gray-400">
                Types: {Array.from(new Set(elements.map((e) => e.type))).join(", ")}
              </span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function SkeletonPreview({ elements }: { elements: ElementInfo[] }) {
  // Group elements by vertical position
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

  rows.sort((a, b) => a[0]!.y - b[0]!.y);
  rows.forEach((row) => row.sort((a, b) => a.x - b.x));

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={row.length > 1 ? "flex items-center gap-4" : ""}>
          {row.map((el, elIndex) => (
            <Skeleton
              key={elIndex}
              className={`${getHeightClass(el.height)} ${getWidthClass(el.width)} ${
                el.type === "circle" || el.type === "avatar" ? "rounded-full" : ""
              } ${el.type === "button" ? "rounded-md" : ""}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
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
