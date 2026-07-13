import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import VerifyBlock from "@/components/docs/VerifyBlock";
import BenefitGrid from "@/components/docs/BenefitCard";

export function Section22() {
  return (
    <Section id="http-errors" num={22} title="HTTP 400 vs 500">
      <Prose>
        HTTP status codes are the server&apos;s way of telling the Client
        &quot;what happened&quot;. We divide them into two main categories: 4xx
        (client error) and 5xx (server error).
      </Prose>

      {/* ── 1. 4xx Client Errors ── */}
      <Subsection title="4xx — Client Errors (user error)">
        <BenefitGrid
          cards={[
            {
              icon: "\uD83D\uDD0D",
              title: "400 Bad Request",
              body: "The request is not understood by the server \u2014 bad syntax, large header, payload doesn't match specifications.",
            },
            {
              icon: "\uD83D\uDEAB",
              title: "401 Unauthorized",
              body: "Not authorized \u2014 needs login. Authentication is missing or invalid.",
            },
            {
              icon: "\u26D4",
              title: "403 Forbidden",
              body: "The server understood the request but won't allow it \u2014 permissions, IP block, SELinux.",
            },
            {
              icon: "\u2753",
              title: "404 Not Found",
              body: "The resource doesn't exist. Most famous error \u2014 wrong path, file deleted, broken link.",
            },
            {
              icon: "\u23F1",
              title: "408 Request Timeout",
              body: "The client took too long to send the request. Usually due to slow internet or a proxy issue.",
            },
            {
              icon: "\uD83D\uDD04",
              title: "429 Too Many Requests",
              body: "Rate limiting \u2014 the client exceeded the allowed request limit. Common in APIs.",
            },
          ]}
        />
      </Subsection>

      {/* ── 2. 5xx Server Errors ── */}
      <Subsection title="5xx — Server Errors (server error)">
        <BenefitGrid
          cards={[
            {
              icon: "\uD83D\uDCA5",
              title: "500 Internal Server Error",
              body: "General server error \u2014 no details. Usually due to application crash, PHP fatal error, or misconfiguration.",
            },
            {
              icon: "\u26A0",
              title: "502 Bad Gateway",
              body: "The server (e.g. Nginx) tried to connect to upstream (e.g. PHP-FPM) and it didn't respond. Most common problem with reverse proxy.",
            },
            {
              icon: "\uD83D\uDD0C",
              title: "503 Service Unavailable",
              body: "The server can't serve \u2014 overload, maintenance, or connections exhausted.",
            },
            {
              icon: "\u231B",
              title: "504 Gateway Timeout",
              body: "The upstream didn't respond in time. Usually due to a slow application or heavy database query.",
            },
          ]}
        />
      </Subsection>

      {/* ── 3. Troubleshooting Guide ── */}
      <Subsection title="Troubleshooting Guide — What to do when you see an error code">
        <InfoTable
          columns={[
            { header: "Code", key: "code" },
            { header: "First thing to check", key: "check" },
          ]}
          rows={[
            {
              code: "<strong>400</strong>",
              check: "Check request headers and body \u2014 what exactly is the client sending",
            },
            {
              code: "<strong>401</strong>",
              check: "Check authentication token or cookies",
            },
            {
              code: "<strong>403</strong>",
              check: 'Check permissions (<code>ls -la</code>), SELinux (<code>ausearch -m avc</code>), <code>nginx.conf</code> allow/deny rules',
            },
            {
              code: "<strong>404</strong>",
              check: "Check path, root directive in nginx/Apache, symlinks",
            },
            {
              code: "<strong>429</strong>",
              check: "Reduce rate from client or increase limits on server",
            },
            {
              code: "<strong>500</strong>",
              check: "Check logs (<code>journalctl -u nginx</code>, app logs, PHP error log)",
            },
            {
              code: "<strong>502</strong>",
              check: "Make sure upstream (PHP-FPM, uWSGI, Gunicorn) is running: <code>systemctl status php-fpm</code>",
            },
            {
              code: "<strong>503</strong>",
              check: "Is traffic high? Check <code>ss -s</code>, <code>top</code>, connections limits",
            },
            {
              code: "<strong>504</strong>",
              check: "Increase timeout in config \u2014 <code>proxy_read_timeout</code>, <code>fastcgi_read_timeout</code>",
            },
          ]}
        />

        <VerifyBlock label="400 vs 500 — The Golden Rule">
          <p>
            4xx {"\u2190"} problem is with the client (user) \u2014 fix the
            request.
          </p>
          <p>
            5xx {"\u2190"} problem is with the server (you) \u2014 fix the
            service.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
