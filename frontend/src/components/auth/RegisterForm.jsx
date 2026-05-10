import { useMemo, useState } from "react";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Mail, Phone, UserPlus, UserRound } from "lucide-react";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import {
  AuthCheckbox,
  AuthField,
  AuthFormShell,
  SocialAuthButtons,
} from "./AuthLayout";
import { cn } from "../../utils/classNames";
import { createTouchedMap, focusFirstInvalidField, getVisibleFieldErrors } from "../../utils/formValidation";

const initialValues = {
  acceptTerms: false,
  confirmPassword: "",
  email: "",
  fullName: "",
  marketing: true,
  password: "",
  phone: "",
};

const REGISTER_FIELD_ORDER = ["fullName", "email", "phone", "password", "confirmPassword", "acceptTerms"];

function getPasswordChecks(password) {
  return [
    {
      label: "Tối thiểu 8 ký tự",
      passed: password.length >= 8,
    },
    {
      label: "Có chữ hoa và chữ thường",
      passed: /[A-Z]/.test(password) && /[a-z]/.test(password),
    },
    {
      label: "Có ít nhất 1 số",
      passed: /\d/.test(password),
    },
  ];
}

function validateRegister(values) {
  const errors = {};
  const email = values.email.trim();
  const fullName = values.fullName.trim();
  const phone = values.phone.trim();
  const passwordChecks = getPasswordChecks(values.password);

  if (!fullName) {
    errors.fullName = "Vui lòng nhập họ tên.";
  } else if (fullName.length < 2) {
    errors.fullName = "Họ tên cần ít nhất 2 ký tự.";
  }

  if (!email) {
    errors.email = "Vui lòng nhập email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email chưa đúng định dạng.";
  }

  if (!phone) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (!/^(0|\+84)[0-9\s.-]{8,13}$/.test(phone)) {
    errors.phone = "Số điện thoại chưa đúng định dạng.";
  }

  if (!values.password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (passwordChecks.some((check) => !check.passed)) {
    errors.password = "Mật khẩu cần mạnh hơn để tạo tài khoản.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = "Vui lòng đồng ý với điều khoản mua hàng.";
  }

  return errors;
}

function PasswordStrength({ checks, password }) {
  const score = checks.filter((check) => check.passed).length;
  const label = score === 3 ? "Mạnh" : score === 2 ? "Khá" : password ? "Yếu" : "Chưa nhập";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-caption text-slate-400">Độ mạnh mật khẩu</span>
        <span className={cn("text-xs font-black", score === 3 ? "text-emerald-200" : score === 2 ? "text-amber-200" : "text-slate-500")}>
          {label}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((index) => (
          <span
            className={cn(
              "h-1.5 rounded-full",
              index < score ? (score === 3 ? "bg-emerald-300" : "bg-amber-300") : "bg-slate-800",
            )}
            key={index}
          />
        ))}
      </div>
      <div className="mt-3 grid gap-2">
        {checks.map((check) => (
          <p className={cn("text-caption flex items-center gap-2", check.passed ? "text-emerald-200" : "text-slate-500")} key={check.label}>
            <CheckCircle2 size={14} />
            {check.label}
          </p>
        ))}
      </div>
    </div>
  );
}

function RegisterForm() {
  const [values, setValues] = useState(initialValues);
  const [touchedFields, setTouchedFields] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordChecks = useMemo(() => getPasswordChecks(values.password), [values.password]);
  const validationErrors = useMemo(() => validateRegister(values), [values]);
  const visibleErrors = useMemo(
    () => getVisibleFieldErrors(validationErrors, touchedFields, submitAttempted),
    [submitAttempted, touchedFields, validationErrors],
  );

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

  const handleCheckboxChange = (fieldName) => (checked) => {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: checked,
    }));
    setTouchedFields((currentFields) => ({
      ...currentFields,
      [fieldName]: true,
    }));
    setFeedback(null);
  };

  const handlePlaceholder = (provider) => {
    setFeedback({
      message: `Đăng ký bằng ${provider} sẽ được bật trong giai đoạn tích hợp tài khoản.`,
      tone: "info",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setTouchedFields(createTouchedMap(REGISTER_FIELD_ORDER));

    if (Object.keys(validationErrors).length > 0) {
      setFeedback({
        message: "Vui lòng hoàn tất các trường bắt buộc trước khi tạo tài khoản.",
        tone: "info",
      });
      focusFirstInvalidField(validationErrors, REGISTER_FIELD_ORDER);
      return;
    }

    setIsSubmitting(true);
    setFeedback({
      message: "Đang kiểm tra thông tin đăng ký...",
      tone: "info",
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setFeedback({
        message: "Thông tin tạo tài khoản hợp lệ. Hồ sơ khách hàng sẽ được lưu khi hệ thống tích hợp sẵn sàng.",
        tone: "success",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthFormShell
      busy={isSubmitting}
      feedback={feedback}
      onSubmit={handleSubmit}
      subtitle="Tạo hồ sơ khách hàng để chuẩn bị cho checkout nhanh và ưu đãi cá nhân hóa."
      title="Tạo tài khoản"
    >
      <SocialAuthButtons disabled={isSubmitting} onPlaceholder={handlePlaceholder} />

      <AuthField
        autoComplete="name"
        disabled={isSubmitting}
        error={visibleErrors.fullName}
        icon={UserRound}
        id="fullName"
        label="Họ và tên"
        onBlur={handleBlur("fullName")}
        onChange={handleChange("fullName")}
        placeholder="Nguyễn Văn A"
        required
        value={values.fullName}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField
          autoComplete="email"
          disabled={isSubmitting}
          error={visibleErrors.email}
          icon={Mail}
          id="email"
          inputMode="email"
          label="Email"
          onBlur={handleBlur("email")}
          onChange={handleChange("email")}
          placeholder="you@example.com"
          required
          type="email"
          value={values.email}
        />
        <AuthField
          autoComplete="tel"
          disabled={isSubmitting}
          error={visibleErrors.phone}
          icon={Phone}
          id="phone"
          inputMode="tel"
          label="Số điện thoại"
          onBlur={handleBlur("phone")}
          onChange={handleChange("phone")}
          placeholder="0901234567"
          required
          value={values.phone}
        />
      </div>

      <AuthField
        autoComplete="new-password"
        disabled={isSubmitting}
        error={visibleErrors.password}
        icon={KeyRound}
        id="password"
        label="Mật khẩu"
        onBlur={handleBlur("password")}
        onChange={handleChange("password")}
        placeholder="Tạo mật khẩu mạnh"
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

      <PasswordStrength checks={passwordChecks} password={values.password} />

      <AuthField
        autoComplete="new-password"
        disabled={isSubmitting}
        error={visibleErrors.confirmPassword}
        icon={KeyRound}
        id="confirmPassword"
        label="Xác nhận mật khẩu"
        onBlur={handleBlur("confirmPassword")}
        onChange={handleChange("confirmPassword")}
        placeholder="Nhập lại mật khẩu"
        required
        rightElement={
          <IconButton
            aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
            className="h-8 w-8 rounded-lg border-white/10 bg-white/[0.04] text-slate-300 hover:text-white"
            disabled={isSubmitting}
            onClick={() => setShowConfirmPassword((current) => !current)}
            size="sm"
            variant="outline"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </IconButton>
        }
        type={showConfirmPassword ? "text" : "password"}
        value={values.confirmPassword}
      />

      <div className="grid gap-3">
        <AuthCheckbox
          checked={values.acceptTerms}
          disabled={isSubmitting}
          error={visibleErrors.acceptTerms}
          id="acceptTerms"
          onChange={handleCheckboxChange("acceptTerms")}
          required
        >
          Tôi đồng ý với điều khoản mua hàng và chính sách bảo hành.
        </AuthCheckbox>

        <AuthCheckbox checked={values.marketing} disabled={isSubmitting} id="marketing" onChange={handleCheckboxChange("marketing")}>
          Nhận thông tin ưu đãi gaming gear và sản phẩm mới.
        </AuthCheckbox>
      </div>

      <Button className="h-12 rounded-2xl" disabled={isSubmitting} fullWidth type="submit">
        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
        {isSubmitting ? "Đang kiểm tra..." : "Tạo tài khoản"}
      </Button>
    </AuthFormShell>
  );
}

export default RegisterForm;
