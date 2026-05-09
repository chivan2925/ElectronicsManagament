import { ArrowRight, CheckCircle2 } from "lucide-react";
import AnnouncementBar from "../layout/AnnouncementBar";
import Header from "../layout/Header";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Container from "../ui/Container";

function ClientPlaceholderPage({
  badge = "SẮP RA MẮT",
  title,
  subtitle,
  features = [],
  primaryLabel = "Tiếp tục mua sắm",
  secondaryLabel = "Về trang chủ",
}) {
  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />

      <Container as="main" className="py-10">
        <Card className="relative overflow-hidden p-6 md:p-8 lg:p-10" variant="glass">
          <div className="pointer-events-none absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-10rem] left-[-10rem] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <Badge className="mb-5" variant="primary">
                {badge}
              </Badge>

              <h1 className="text-heading max-w-3xl">{title}</h1>
              <p className="text-muted mt-4 max-w-2xl text-base md:text-lg">{subtitle}</p>

              {features.length > 0 && (
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {features.map((feature) => (
                    <li className="text-muted flex items-start gap-3 text-sm font-semibold" key={feature}>
                      <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300 drop-shadow-[0_0_12px_rgba(110,231,183,0.45)]" size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Button as="a" href="/products" size="lg">
                  {primaryLabel}
                  <ArrowRight size={17} />
                </Button>
                <Button as="a" href="/" size="lg" variant="outline">
                  {secondaryLabel}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(0,91,255,0.22),rgba(2,6,23,0.78)_60%)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              <div className="aspect-square rounded-xl border border-blue-300/20 bg-white/[0.04] p-5">
                <div className="flex h-full items-center justify-center rounded-xl bg-slate-950/60 text-center ring-1 ring-white/10">
                  <div>
                    <p className="text-5xl font-black text-blue-300">PCE</p>
                    <p className="mt-2 text-sm font-bold text-slate-400">Electronics & Gaming</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default ClientPlaceholderPage;
