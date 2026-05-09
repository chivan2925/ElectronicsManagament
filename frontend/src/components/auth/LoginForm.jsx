import { useMemo, useState } from "react";
import { Loader2, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../api/authService";
import { getLoginErrorFeedback } from "../../api/errorUtils";
import { buildAuthSession, canAccessAdmin } from "../../auth/authHelpers";
import useAuth from "../../auth/useAuth";
import { getSafeRedirectPath, isGuestOnlyPath } from "../../guards/routeGuardUtils";
import { useToast } from "../ui/toast";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import {
  AuthCheckbox,
  AuthField,
  AuthFormShell,
  SocialAuthButtons,
} from "./AuthLayout";

const initialValues = {
  identity: "",
  password: "",
  remember: true,
};

function validateLogin(values) {
  const errors = {};
  const identity = values.identity.trim();
  const password = values.password.trim();

  if (!identity) {
    errors.identity = "Vui lòng nhập email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity)) {
    errors.identity = "Email chưa đúng định dạng.";
  }

  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu cần ít nhất 6 ký tự.";
  }

  return errors;
}

function mapBackendDetails(details) {
  if (!details || typeof details !== "object") {
    return {};
  }

  return {
    identity: details.email ?? details.username ?? null,
    password: details.password ?? null,
  };
}

function canUseLoginRedirect(session, redirectTo) {
  if (!redirectTo || isGuestOnlyPath(redirectTo)) {
    return false;
  }

  if (redirectTo.startsWith("/admin")) {
    return canAccessAdmin(session);
  }

  return true;
}

function getLoginRedirect(session, rememberedPath) {
  const fallback = canAccessAdmin(session) ? "/admin/dashboard" : "/";

  return canUseLoginRedirect(session, rememberedPath) ? rememberedPath : fallback;
}

function LoginForm({
  showSocialAuth = true,
  submitLabel = "Đăng nhập",
  subtitle = "Đăng nhập để chuẩn bị lưu giỏ hàng, theo dõi đơn và nhận ưu đãi khách hàng.",
  title = "Đăng nhập",
}) {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [values, setValues] = useState(initialValues);
  const [touchedFields, setTouchedFields] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [serverErrors, setServerErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationErrors = useMemo(() => validateLogin(values), [values]);
  const visibleErrors = Object.keys(validationErrors).reduce((currentErrors, fieldName) => {
    if (submitAttempted || touchedFields[fieldName]) {
      return {
        ...currentErrors,
        [fieldName]: validationErrors[fieldName],
      };
    }

    return currentErrors;
  }, serverErrors);

  const handleChange = (fieldName) => (event) => {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: event.target.value,
    }));
    setFeedback(null);
    setServerErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: null,
    }));
  };

  const handleBlur = (fieldName) => () => {
    setTouchedFields((currentFields) => ({
      ...currentFields,
      [fieldName]: true,
    }));
  };

  const handlePlaceholder = (provider) => {
    const message = `Đăng nhập bằng ${provider} sẽ được bật sau khi OAuth được tích hợp.`;
    setFeedback({ message, tone: "info" });
    toast.showInfo(message);
  };

  const handleForgotPassword = () => {
    const message = "Khôi phục mật khẩu sẽ được bật khi backend hỗ trợ luồng đặt lại mật khẩu.";
    setFeedback({ message, tone: "info" });
    toast.showInfo(message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerErrors({});
    setSubmitAttempted(true);
    setTouchedFields({
      identity: true,
      password: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      const message = "Vui lòng kiểm tra thông tin đăng nhập trước khi tiếp tục.";
      setFeedback({ message, tone: "info" });
      toast.showWarning(message);
      return;
    }

    setIsSubmitting(true);
    setFeedback({
      message: "Đang xác thực tài khoản với hệ thống...",
      tone: "info",
    });

    try {
      const response = await authService.login({
        email: values.identity.trim(),
        password: values.password,
      });
      const session = buildAuthSession(response);
      auth.setAuthSession(session);

      const rememberedPath = getSafeRedirectPath(location.state?.from, null);
      const redirectTo = getLoginRedirect(session, rememberedPath);
      const isAdminDestination = redirectTo.startsWith("/admin");
      const message = isAdminDestination
        ? "Đăng nhập thành công. Đang chuyển đến admin dashboard."
        : "Đăng nhập thành công. Đang quay về cửa hàng.";

      setFeedback({ message, tone: "success" });
      toast.showSuccess(message);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const loginError = getLoginErrorFeedback(error);
      const mappedErrors = mapBackendDetails(loginError.details);

      setServerErrors(mappedErrors);
      setFeedback({
        message: loginError.message,
        tone: "error",
      });
      toast.showError(loginError.message, {
        title:
          loginError.type === "network"
            ? "Không kết nối được"
            : loginError.type === "disabled"
              ? "Tài khoản bị khóa"
              : "Đăng nhập thất bại",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthFormShell
      feedback={feedback}
      onSubmit={handleSubmit}
      subtitle={subtitle}
      title={title}
    >
      {showSocialAuth && <SocialAuthButtons disabled={isSubmitting} onPlaceholder={handlePlaceholder} />}

      <AuthField
        autoComplete="username"
        disabled={isSubmitting}
        error={visibleErrors.identity}
        icon={Mail}
        id="identity"
        inputMode="email"
        label="Email"
        onBlur={handleBlur("identity")}
        onChange={handleChange("identity")}
        placeholder="you@example.com"
        required
        value={values.identity}
      />

      <AuthField
        autoComplete="current-password"
        disabled={isSubmitting}
        error={visibleErrors.password}
        icon={KeyRound}
        id="password"
        label="Mật khẩu"
        onBlur={handleBlur("password")}
        onChange={handleChange("password")}
        placeholder="Nhập mật khẩu"
        required
        rightElement={
          <IconButton
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="h-8 w-8 rounded-lg border-white/10 bg-white/[0.04] text-slate-300 hover:text-white"
            disabled={isSubmitting}
            onClick={() => setShowPassword((current) => !current)}
            size="sm"
            variant="outline"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </IconButton>
        }
        type={showPassword ? "text" : "password"}
        value={values.password}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AuthCheckbox
          checked={values.remember}
          id="remember"
          onChange={(checked) => {
            if (isSubmitting) {
              return;
            }

            setValues((currentValues) => ({
              ...currentValues,
              remember: checked,
            }));
          }}
        >
          Ghi nhớ đăng nhập
        </AuthCheckbox>

        <button
          className="w-fit text-sm font-black text-blue-200 transition-default hover:text-white"
          disabled={isSubmitting}
          onClick={handleForgotPassword}
          type="button"
        >
          Quên mật khẩu?
        </button>
      </div>

      <Button className="h-12 rounded-2xl" disabled={isSubmitting} fullWidth type="submit">
        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
        {isSubmitting ? "Đang đăng nhập..." : submitLabel}
      </Button>
    </AuthFormShell>
  );
}

export default LoginForm;
