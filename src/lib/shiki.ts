import { getSingletonHighlighter } from "shiki";

let loaded = false;

export async function highlight(code: string, lang: string) {
  const shiki = await getSingletonHighlighter({
    langs: [
      "bash",
      "yaml",
      "json",
      "xml",
      "dockerfile",
      "shellscript",
      "powershell",
      "ini",
      "toml",
    ],
    themes: ["github-dark", "github-light"],
  });

  if (!loaded) {
    loaded = true;
  }

  const html = shiki.codeToHtml(code, {
    lang,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
  });

  return html.replace(/^<pre[^>]*>/, "").replace(/<\/pre>$/, "");
}
