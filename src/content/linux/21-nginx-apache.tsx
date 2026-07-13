import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import BenefitGrid from "@/components/docs/BenefitCard";

export function Section21() {
  return (
    <Section id="nginx-apache" num={21} title="Nginx vs Apache">
      <Prose>
        Nginx and Apache are the most popular web servers in the world. Each has
        its philosophy and strengths. Choosing the right one depends on the use
        case.
      </Prose>

      {/* ── 1. Comprehensive Comparison ── */}
      <Subsection title="Comprehensive Comparison">
        <BenefitGrid
          cards={[
            {
              icon: "\u26A1",
              title: "Nginx",
              body: "Event-driven architecture \u2014 handles thousands of concurrent connections with a single thread. Very high performance for static content. Low memory consumption. Excellent as a reverse proxy and load balancer.",
            },
            {
              icon: "\uD83D\uDD27",
              title: "Apache",
              body: "Process-based architecture \u2014 each connection takes a thread or process. High flexibility with .htaccess and dynamic per-directory configuration. Huge number of modules (mod_rewrite, mod_ssl, etc.).",
            },
          ]}
        />

        <InfoTable
          columns={[
            { header: "Feature", key: "feature" },
            { header: "Nginx", key: "nginx" },
            { header: "Apache", key: "apache" },
          ]}
          rows={[
            {
              feature: "Architecture",
              nginx: "Event-driven (async)",
              apache: "Process/Thread-based",
            },
            {
              feature: "Static content",
              nginx: "Excellent \u2014 very fast",
              apache: "Good",
            },
            {
              feature: "Dynamic content",
              nginx: "Needs FastCGI (PHP-FPM)",
              apache: "Built-in (mod_php)",
            },
            {
              feature: ".htaccess",
              nginx: "Only supports in main config",
              apache: "Supports in any directory \u2014 high flexibility",
            },
            {
              feature: "Memory usage",
              nginx: "Low \u2014 suitable for VPS",
              apache: "Higher \u2014 depends on loaded modules",
            },
            {
              feature: "High Concurrency",
              nginx: "Excellent \u2014 thousands of connections",
              apache: "Can degrade with many connections",
            },
            {
              feature: "Reverse Proxy",
              nginx: "Built-in and excellent",
              apache: "Supports via mod_proxy",
            },
            {
              feature: "Learning difficulty",
              nginx: "Medium \u2014 simple and centralized config",
              apache: "Easy for beginners",
            },
            {
              feature: "Operating systems",
              nginx: "Unix-like (Windows limited)",
              apache: "All systems (Windows native)",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Config Comparison">
{`# Nginx — single config file for the server
server {
    listen       80;
    server_name  example.com;
    root         /var/www/html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Apache — relies on Directory blocks and .htaccess
<VirtualHost *:80>
    DocumentRoot /var/www/html
    ServerName   example.com
    <Directory /var/www/html>
        AllowOverride All
    </Directory>
</VirtualHost>`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Summary:</strong> Use Nginx if you want high performance,
          reverse proxy, static files. Use Apache if you need{" "}
          <code>.htaccess</code> and compatibility with old scripts or if your
          team is used to it. Many people use Nginx as a reverse proxy in front
          of Apache (the best of both).
        </Callout>
      </Subsection>
    </Section>
  );
}
