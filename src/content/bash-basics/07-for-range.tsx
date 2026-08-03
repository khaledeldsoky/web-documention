import Section from "@/components/docs/Section";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section7() {
  return (
    <Section id="for-range" num={7} title="For Loop — Numeric Range">
      <CodeBlock lang="bash" label="iterate over a range">
{`#!/bin/bash
for i in {1..5}; do
    echo "Number: $i"
done`}
      </CodeBlock>
    </Section>
  );
}
