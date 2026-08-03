import Section from "@/components/docs/Section";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section1() {
  return (
    <Section id="if-file" num={1} title="Check if a File Exists">
      <CodeBlock lang="bash" label="file existence check">
{`#!/bin/bash
file="test.txt"
if [ -f "$file" ]; then
    echo "$file exists"
else
    echo "$file does not exist"
fi`}
      </CodeBlock>
    </Section>
  );
}
