import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section20() {
  return (
    <Section id="commands" num={20} title="Essential Commands">
      <Prose>
        A quick reference for common Linux commands used in daily system
        administration and scripting.
      </Prose>

      {/* ── awk ── */}
      <Subsection id="commands-awk" title="awk — Text Processing">
        <CodeBlock lang="bash" label="Basic awk usage">
{`# Print each line of the file
awk '{print $0}' file.txt

# Print lines matching a pattern
awk '/pattern/ {print $0}' file.txt

# Print the first column
awk '{print $1}' file.txt

# Print first and third columns
awk '{print $1, $3}' file.txt

# Use ":" as field separator, print first field
awk -F":" '{print $1}' /etc/passwd

# Sum values of the first field
awk '{sum += $1} END {print sum}' file.txt`}
        </CodeBlock>
      </Subsection>

      {/* ── grep & find ── */}
      <Subsection id="commands-grep-find" title="grep & find — Search">
        <CodeBlock lang="bash" label="grep — search file contents">
{`# Search for "error" in all files in current dir
grep "error" *

# Search recursively, show only filenames
grep -rl "500" /var/log`}
        </CodeBlock>

        <CodeBlock lang="bash" label="find — search for files">
{`# Find and delete all .doc files
find . -type f -name "*.doc" -delete

# Find and run sed on all .txt files
find . -type f -name '*.txt' -exec sed -i 's/old/new/g' {} +

# Print only filenames (no path)
find . -type f -printf "%f\\n"`}
        </CodeBlock>
      </Subsection>

      {/* ── cut & tr & base64 ── */}
      <Subsection id="commands-cut-tr-base64" title="cut & tr & base64 — Text Manipulation">
        <CodeBlock lang="bash" label="cut — extract columns">
{`# Extract fields 2 and onward using : delimiter
cut -d: -f2-`}
        </CodeBlock>

        <CodeBlock lang="bash" label="tr — translate characters">
{`# Replace all 'a' with 'A'
tr 'a' 'A'`}
        </CodeBlock>

        <CodeBlock lang="bash" label="base64 — encode / decode">
{`# Encode a string
echo -n "my-secret-key" | base64

# Encode a file
base64 config.json > config.b64

# Decode a Base64 string
echo "bXktc2VjcmV0LWtleQ==" | base64 --decode`}
        </CodeBlock>
      </Subsection>

      {/* ── alias & dig ── */}
      <Subsection id="commands-alias-dig" title="alias & dig — Shell Helpers">
        <CodeBlock lang="bash" label="alias — create shortcuts">
{`# Create and remove an alias
alias khaled="ls -a"
unalias khaled`}
        </CodeBlock>

        <CodeBlock lang="bash" label="dig — DNS lookup">
{`# Get your public IP via DNS
dig +short myip.opendns.com @resolver1.opendns.com`}
        </CodeBlock>
      </Subsection>

      {/* ── scp ── */}
      <Subsection id="commands-scp" title="scp — Secure File Transfer">
        <CodeBlock lang="bash" label="Copy files over SSH">
{`# Copy a local file to a remote server with a specific key
scp -i /path/to/key /path/to/local/file user@remote:/remote/path

# Copy a directory recursively
scp -r /path/to/local/dir ssh_host:/remote/path

# Copy a file from remote to local
scp user@remote:/remote/file .`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
