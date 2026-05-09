import { useMemo, useState } from "react";
import { Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react";
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
    errors.identity = "Vui lòng nhập email hoặc số điện thoại.";
  } else if (identity.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity)) {
    errors.identity = "Email chưa đúng định dạng.";
  } else if (!identity.includes("@") && !/^(0|\+84)[0-9\s.-]{8,13}$/.test(identity)) {
    errors.identity = "Số điện thoại chưa đúng định dạng.";
  }

  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu cần ít nhất 6 ký tự.";
  }

  return errors;
}

function LoginForm() {
  const [values, setValues] = useState(initialValues);
  const [touchedFields, setTouchedFields] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const validationErrors = useMemo(() => validateLogin(values), [values]);
  const visibleErrors = Object.keys(validationErrors).reduce((currentErrors, fieldName) => {
    if (submitAttempted || touchedFields[fieldName]) {
      return {
        ...currentErrors,
        [fieldName]: validationErrors[fieldName],
      };
    }

    return currentErrors;
  }, {});

  const handleChange = (fieldName) => (event) => {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: event.target.value,
    }));
    setFeedback(null);
  };

  const handleBlur = (fieldName) => () => {
    setTouchedFields((currentFields) => ({
      ...currentFields,
      [fieldName]: true,
    }));
  };

  const handlePlaceholder = (provider) => {
    setFeedback({
      message: `Đăng nhập bằng ${provider} sẽ được bật trong giai đoạn tích hợp tài khoản.`,
      tone: "info",
    });
  };

  const handleForgotPassword = () => {
    setFeedback({
      message: "Khôi phục mật khẩu sẽ được bật trong giai đoạn tích hợp tài khoản.",
      tone: "info",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setTouchedFields({
      identity: true,
      password: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      setFeedback({
        message: "Vui lòng kiểm tra thông tin đăng nhập trước khi tiếp tục.",
        tone: "info",
      });
      return;
    }

    setFeedback({
      message: values.remember
        ? "Thông tin đăng nhập hợp lệ. Tùy chọn ghi nhớ đã sẵn sàng cho bước tích hợp."
        : "Thông tin đăng nhập hợp lệ. Tài khoản sẽ được xác thực khi hệ thống tích hợp sẵn sàng.",
      tone: "success",
    });
  };

  return (
    <AuthFormShell
      feedback={feedback}
      onSubmit={handleSubmit}
      subtitle="Đăng nhập để chuẩn bị lưu giỏ hàng, theo dõi đơn và nhận ưu đãi khách hàng."
      title="Đăng nhập"
    >
      <SocialAuthButtons onPlaceholder={handlePlaceholder} />

      <AuthField
        autoComplete="username"
        error={visibleErrors.identity}
        icon={Mail}
        id="identity"
        inputMode="email"
        label="Email hoặc số điện thoại"
        onBlur={handleBlur("identity")}
        onChange={handleChange("identity")}
        placeholder="you@example.com hoặc 0901234567"
        required
        value={values.identity}
      />

      <AuthField
        autoComplete="current-password"
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
          onChange={(checked) =>
            setValues((currentValues) => ({
              ...currentValues,
              remember: checked,
            }))
          }
        >
          Ghi nhớ đăng nhập
        </AuthCheckbox>

        <button
          className="w-fit text-sm font-black text-blue-200 transition-default hover:text-white"
          onClick={handleForgotPassword}
          type="button"
        >
          Quên mật khẩu?
        </button>
      </div>

      <Button className="h-12 rounded-2xl" fullWidth type="submit">
        <ShieldCheck size={18} />
        Đăng nhập
      </Button>
    </AuthFormShell>
  );
}

export default LoginForm;
