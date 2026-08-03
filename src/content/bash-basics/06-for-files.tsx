import Section from "@/components/docs/Section";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section6() {
  return (
    <Section id="for-files" num={6} title="For Loop — Loop Over Files">
      <CodeBlock lang="bash" label="loop over files in directory">
{`#!/bin/bash
for file in *.txt; do
    echo "Found file: \${file}"
done`}
      </CodeBlock>

      <CodeBlock lang="bash" label="list all files in current dir">
{`#!/bin/bash
for file in *; do
    echo "File: $file"
done`}
      </CodeBlock>
    </Section>
  );
}
