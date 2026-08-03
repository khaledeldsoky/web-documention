import Section from "@/components/docs/Section";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section11() {
  return (
    <Section id="functions" num={11} title="Functions">
      <CodeBlock lang="bash" label="define and call a function">
{`#!/bin/bash

# Define a function
my_function() {
    echo "Hello, $1!"
}

# Call the function with an argument
my_function "User"`}
      </CodeBlock>
    </Section>
  );
}
