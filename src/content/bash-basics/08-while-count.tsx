import Section from "@/components/docs/Section";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section8() {
  return (
    <Section id="while-count" num={8} title="While Loop — Count">
      <CodeBlock lang="bash" label="count from 1 to 5">
{`#!/bin/bash
count=1
while [ $count -le 5 ]; do
    echo "Count: $count"
    ((count++))
done`}
      </CodeBlock>

      <CodeBlock lang="bash" label="print numbers 1 to 10">
{`num=1
while [ $num -le 10 ]; do
    echo "$num"
    ((num++))
done`}
      </CodeBlock>
    </Section>
  );
}
