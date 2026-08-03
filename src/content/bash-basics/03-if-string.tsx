import Section from "@/components/docs/Section";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section3() {
  return (
    <Section id="if-string" num={3} title="Compare Strings">
      <CodeBlock lang="bash" label="string comparison">
{`#!/bin/bash
user="Alice"
if [ "$user" = "Alice" ]; then
    echo "Welcome, $user!"
else
    echo "Unknown user"
fi`}
      </CodeBlock>
    </Section>
  );
}
