import { Link } from "react-router-dom";
import { ClipboardList, MonitorPlay, Route, UserRound } from "lucide-react";
import { DEMO_ACCOUNTS, DEMO_PRESENTATION_NOTES, DEMO_SCENARIOS } from "../../../demo/demoMode";

function DemoPresentationPanel() {
  return (
    <section className="admin-panel overflow-hidden rounded-2xl border-blue-100 bg-gradient-to-br from-white via-blue-50/55 to-white">
      <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-black text-primary">
            <MonitorPlay size={14} />
            Presentation mode
          </div>
          <h2 className="mt-4 text-xl font-black text-slate-950">Demo runbook</h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
            Local demo mode uses seeded mock API data, demo auth sessions, and stable ecommerce/admin scenarios for smooth presentation runs.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {DEMO_SCENARIOS.slice(0, 4).map((scenario) => (
              <Link
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-admin-card"
                key={scenario.title}
                to={scenario.route}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100">
                    <Route size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-950">{scenario.title}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">{scenario.focus} · {scenario.duration}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <UserRound className="text-primary" size={18} />
              <h3 className="text-sm font-black text-slate-950">Demo accounts</h3>
            </div>
            <div className="grid gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <div className="rounded-xl bg-slate-50 px-3 py-2" key={account.id}>
                  <p className="text-sm font-black text-slate-800">{account.label}</p>
                  <p className="truncate text-xs font-semibold text-slate-500">{account.email}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <ClipboardList className="text-primary" size={18} />
              <h3 className="text-sm font-black text-slate-950">Presenter notes</h3>
            </div>
            <ul className="space-y-2">
              {DEMO_PRESENTATION_NOTES.slice(0, 3).map((note) => (
                <li className="text-xs font-bold leading-5 text-slate-500" key={note}>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default DemoPresentationPanel;
