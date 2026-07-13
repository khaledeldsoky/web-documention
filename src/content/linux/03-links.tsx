import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section3() {
  return (
    <Section id="links" num={3} title="Hard & Symbolic Links">
      <Prose>
        Links in Linux allow creating multiple references to the same file.
        There are two types: Hard Link and Symbolic Link (Soft Link). The
        difference between them is fundamental.
      </Prose>

      <Callout variant="info">
        <strong>Basic info:</strong> Every file in Linux has an inode — a unique
        number that stores the file's data (metadata) except the name. The file
        name is just a link (link) to a specific inode number.
      </Callout>

      {/* ── 1. Comparison Table ── */}
      <Subsection title="Comparison Table">
        <InfoTable
          columns={[
            { header: "Feature", key: "feature" },
            { header: "Hard Link", key: "hard" },
            { header: "Symbolic Link (Soft Link)", key: "soft" },
          ]}
          rows={[
            {
              feature: "Command",
              hard: "<code>ln source target</code>",
              soft: "<code>ln -s source target</code>",
            },
            {
              feature: "Inode number",
              hard: "Same inode as source",
              soft: "Different inode (new file)",
            },
            {
              feature: "Delete source",
              hard: "Link still works — file not actually deleted",
              soft: "Link breaks (broken link)",
            },
            {
              feature: "Across partitions",
              hard: "No — cannot span different filesystems",
              soft: "Yes — can span any path",
            },
            {
              feature: "For directories",
              hard: "No — cannot create a hard link to a directory",
              soft: "Yes — can create a link to a directory",
            },
            {
              feature: "Relative/absolute path",
              hard: "Not important",
              soft: "Path is important — if the file moves, the link breaks",
            },
          ]}
        />
      </Subsection>

      {/* ── 2. Practical Examples ── */}
      <Subsection title="Practical Examples">
        <CodeBlock lang="bash" label="Hard Link — Example">
{`# Create original file
echo "Hello World" > original.txt

# Create Hard Link
ln original.txt hardlink.txt

# Same inode — they are the same file
ls -li original.txt hardlink.txt
# 123456 -rw-r--r-- 2 user user 12 ... original.txt
# 123456 -rw-r--r-- 2 user user 12 ... hardlink.txt

# Delete original — link still works
rm original.txt
cat hardlink.txt  # Hello World`}
        </CodeBlock>

        <CodeBlock lang="bash" label="Symbolic Link — Example">
{`# Create original file
echo "Hello World" > original.txt

# Create Soft Link
ln -s original.txt softlink.txt

# Different inodes — ls -l shows the link
ls -l softlink.txt
# lrwxrwxrwx 1 user user 12 ... softlink.txt -> original.txt

# Delete original — link breaks
rm original.txt
cat softlink.txt  # No such file or directory`}
        </CodeBlock>

        <Callout variant="success">
          <strong>When to use each type?</strong>
          <br />• Use Hard Links for smart backups (like{" "}
          <code>rsnapshot</code>) as they don't consume extra space. Use
          Symbolic Links for shortcuts, cross-partition links, and directories.
        </Callout>
      </Subsection>
    </Section>
  );
}
