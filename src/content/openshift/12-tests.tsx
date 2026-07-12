import Section from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";

export function Section12() {
  return (
    <Section id="tests" num={12} title="Verification Tests">
      <Prose>Verification checks are distributed throughout the guide as green <strong>Verify</strong> blocks next to each major action. Follow each VerifyBlock after completing its associated step — no separate test section is needed.</Prose>
    </Section>
  );
}
