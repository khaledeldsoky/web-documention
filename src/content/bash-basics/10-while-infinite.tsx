import Section from "@/components/docs/Section";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section10() {
  return (
    <Section id="while-infinite" num={10} title="While Loop — Infinite with User Input">
      <CodeBlock lang="bash" label="infinite loop until 'quit'">
{`#!/bin/bash
while true; do
    echo "Enter 'quit' to exit: "
    read input
    if [ "$input" = "quit" ]; then
        break
    fi
    echo "You entered: $input"
done`}
      </CodeBlock>
    </Section>
  );
}
