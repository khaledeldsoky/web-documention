import Section from "@/components/docs/Section";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section5() {
  return (
    <Section id="for-list" num={5} title="For Loop — Iterate Over a List">
      <CodeBlock lang="bash" label="iterate over words">
{`#!/bin/bash
for fruit in apple banana orange; do
    echo "Fruit: $fruit"
done`}
      </CodeBlock>
    </Section>
  );
}
