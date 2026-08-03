import Section from "@/components/docs/Section";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section4() {
  return (
    <Section id="if-empty-dir" num={4} title="Check if Directory is Empty">
      <CodeBlock lang="bash" label="empty directory check">
{`#!/bin/bash
dir="myfolder"
if [ -z "$(ls -A $dir)" ]; then
    echo "$dir is empty"
else
    echo "$dir is not empty"
fi`}
      </CodeBlock>
    </Section>
  );
}
