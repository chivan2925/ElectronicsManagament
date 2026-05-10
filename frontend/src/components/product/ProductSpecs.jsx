import { Cpu, FileText, Sparkles } from "lucide-react";
import Badge from "../ui/Badge";

function ProductSpecs({ description, specs }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_420px]">
      <div className="store-premium-sheen store-glass-soft rounded-3xl p-5 sm:p-6">
        <Badge className="mb-4 gap-2" variant="primary">
          <FileText size={13} />
          Mô tả sản phẩm
        </Badge>
        <h2 className="text-section">Trải nghiệm nổi bật</h2>
        <p className="text-muted mt-3 text-sm sm:text-base">{description.lead}</p>

        <div className="mt-5 grid gap-3">
          {description.paragraphs.map((paragraph) => (
            <p className="text-muted text-sm" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {description.bullets.map((bullet) => (
            <div className="store-action-card rounded-2xl p-3" key={bullet}>
              <Sparkles className="mb-3 text-blue-200" size={18} />
              <p className="text-caption text-slate-300">{bullet}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="store-premium-sheen store-glass-soft rounded-3xl p-5 sm:p-6">
        <Badge className="mb-4 gap-2" variant="primary">
          <Cpu size={13} />
          Thông số
        </Badge>
        <h2 className="text-section">Chi tiết kỹ thuật</h2>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          {specs.map((spec, index) => (
            <div
              className="premium-transition grid grid-cols-[130px_1fr] gap-3 border-b border-white/10 bg-slate-950/28 px-3 py-3 hover:bg-blue-500/[0.055] last:border-b-0 sm:grid-cols-[160px_1fr]"
              key={`${spec.label}-${index}`}
            >
              <p className="text-caption font-black text-slate-400">{spec.label}</p>
              <p className="text-sm font-bold text-white">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductSpecs;
