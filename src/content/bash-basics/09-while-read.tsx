import Section from "@/components/docs/Section";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section9() {
  return (
    <Section id="while-read" num={9} title="While Loop — Read File">
      <CodeBlock lang="bash" label="read file line by line">
{`#!/bin/bash
file="input.txt"
while IFS= read -r line; do
    echo "Line: $line"
done < "$file"`}
      </CodeBlock>
    </Section>
  );
}
