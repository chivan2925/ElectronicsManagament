import { Component } from "react";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

function DefaultErrorFallback({ error, onReset }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050B14] px-4 py-12 text-white">
      <div className="relative isolate w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.16),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.86),rgba(7,17,31,0.98))] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.36)]">
        <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-red-200/40 to-transparent" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/12 text-red-100 shadow-[0_0_32px_rgba(239,68,68,0.2)]">
          <AlertTriangle size={32} />
        </div>

        <h1 className="mt-5 text-2xl font-black tracking-normal text-white">Ứng dụng gặp lỗi</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-300">
          Một phần giao diện vừa bị ngắt. Bạn có thể thử tải lại màn hình hoặc quay về trang chủ để tiếp tục.
        </p>

        {error?.message && (
          <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-xs font-semibold leading-5 text-slate-300">
            {error.message}
          </p>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            className="transition-default inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-white shadow-[0_0_28px_rgba(0,91,255,0.34)] hover:bg-primary-hover"
            onClick={onReset}
            type="button"
          >
            <RefreshCcw size={16} />
            Thử lại
          </button>
          <button
            className="transition-default inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-black text-slate-100 hover:border-blue-300/50 hover:bg-blue-500/10"
            onClick={() => window.location.assign("/")}
            type="button"
          >
            <Home size={16} />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { children, fallback } = this.props;
    const { error, errorInfo } = this.state;

    if (error) {
      if (typeof fallback === "function") {
        return fallback({
          error,
          errorInfo,
          reset: this.handleReset,
        });
      }

      return fallback ?? <DefaultErrorFallback error={error} onReset={this.handleReset} />;
    }

    return children;
  }
}

export default GlobalErrorBoundary;
