"use client";

import { Button, Grid } from "@yuhuanowo/yunui";
import { FeatureCard, HeroAccent, MarketingHero, PageLayout, SectionHeading } from "@yuhuanowo/yunui/patterns";

/** Product copy and actions belong to the host; all UI surfaces are imports. */
export function YunUILanding({ onStart }: { onStart: () => void }) {
  return (
    <PageLayout hideFooter mainClassName="flex-1 pt-0">
      <MarketingHero
        fullHeight={false}
        title={<>Your work, <HeroAccent>in one place.</HeroAccent></>}
        subtitle="Replace this copy with your product's value proposition."
        actions={<Button variant="primary" onClick={onStart}>Get started</Button>}
      />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <SectionHeading title="Built for your workflow" />
        <Grid columns={1} gap={6} className="md:grid-cols-3">
          <FeatureCard title="Connected" description="Your product's first benefit." />
          <FeatureCard title="Focused" description="Your product's second benefit." />
          <FeatureCard title="Clear" description="Your product's third benefit." />
        </Grid>
      </section>
    </PageLayout>
  );
}
