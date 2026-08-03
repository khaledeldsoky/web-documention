import Section from "@/components/docs/Section";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section2() {
  return (
    <Section id="if-number" num={2} title="Compare Numbers">
      <CodeBlock lang="bash" label="numeric comparison">
{`#!/bin/bash
num=15
if [ $num -gt 10 ]; then
    echo "$num is greater than 10"
elif [ $num -eq 10 ]; then
    echo "$num equals 10"
else
    echo "$num is less than 10"
fi`}
      </CodeBlock>
    </Section>
  );
}
