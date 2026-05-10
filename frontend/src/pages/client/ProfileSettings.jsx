import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Camera, Loader2, Save, UserRound } from "lucide-react";
import { normalizePhoneNumber } from "../../api/accountMapper";
import OptimizedImage from "../../components/common/OptimizedImage";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import FormFieldMessage from "../../components/ui/form/FormFieldMessage";
import { useToast } from "../../components/ui/toast";
import { createTouchedMap, focusFirstInvalidField, getVisibleFieldErrors } from "../../utils/formValidation";

const initialValues = {
  avatarUrl: "",
  dateOfBirth: "",
  email: "",
  fullName: "",
  gender: "PREFER_NOT_TO_SAY",
  phoneNumber: "",
  username: "",
};

const PROFILE_FIELD_ORDER = ["fullName", "username", "email", "phoneNumber"];

function getInitials(profile) {
  const name = profile?.fullName || profile?.username || profile?.email || "EM";

  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function buildFormValues(profile) {
  return {
    avatarUrl: profile?.avatarUrl || "",
    dateOfBirth: profile?.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : "",
    email: profile?.email || "",
    fullName: profile?.fullName || "",
    gender: profile?.gender || "PREFER_NOT_TO_SAY",
    phoneNumber: profile?.phoneNumber || profile?.phone || "",
    username: profile?.username || "",
  };
}

function validateProfile(values) {
  const errors = {};
  const phoneNumber = normalizePhoneNumber(values.phoneNumber);

  if (!values.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ tên.";
  }

  if (!values.username.trim()) {
    errors.username = "Vui lòng nhập username.";
  }

  if (!values.email.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Email chưa đúng định dạng.";
  }

  if (!phoneNumber) {
    errors.phoneNumber = "Vui lòng nhập số điện thoại.";
  } else if (phoneNumber.length !== 10) {
    errors.phoneNumber = "Số điện thoại cần có 10 chữ số.";
  }

  return errors;
}

function Field({ children, error, id, label, required = false }) {
  const errorId = `${id}-error`;

  return (
    <div data-field-name={id}>
      <label className="mb-2 block text-sm font-black text-slate-200" htmlFor={id}>
        {label}
        {required ? <span className="ml-1 text-red-300">*</span> : null}
      </label>
      {children}
      <FormFieldMessage id={errorId} tone="error">
        {error}
      </FormFieldMessage>
    </div>
  );
}

function ProfileSettings() {
  const { error, isSavingProfile, profile, updateProfile } = useOutletContext();
  const toast = useToast();
  const [values, setValues] = useState(initialValues);
  const [touchedFields, setTouchedFields] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    let isActive = true;

    Promise.resolve().then(() => {
      if (!isActive) {
        return;
      }

      setValues(buildFormValues(profile));
      setTouchedFields({});
      setSubmitAttempted(false);
    });

    return () => {
      isActive = false;
    };
  }, [profile]);

  const errors = validateProfile(values);
  const visibleErrors = getVisibleFieldErrors(errors, touchedFields, submitAttempted);

  const handleChange = (fieldName, nextValue) => {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: nextValue,
    }));
  };

  const handleBlur = (fieldName) => {
    setTouchedFields((currentFields) => ({
      ...currentFields,
      [fieldName]: true,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setTouchedFields(createTouchedMap(PROFILE_FIELD_ORDER));

    if (Object.keys(errors).length) {
      focusFirstInvalidField(errors, PROFILE_FIELD_ORDER);
      return;
    }

    try {
      await updateProfile({
        ...values,
        phoneNumber: normalizePhoneNumber(values.phoneNumber),
      });
      toast.showSuccess("Hồ sơ tài khoản đã được cập nhật.", {
        title: "Cập nhật thành công",
      });
      setSubmitAttempted(false);
    } catch (submitError) {
      toast.showApiError(submitError, {
        title: "Chưa cập nhật được hồ sơ",
      });
    }
  };

  return (
    <section className="store-surface-panel rounded-3xl p-5 lg:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge className="mb-4 gap-2" variant="primary">
            <UserRound size={13} />
            Settings
          </Badge>
          <h2 className="text-section">Cập nhật hồ sơ</h2>
          <p className="text-muted mt-2 text-sm">Các thay đổi được gửi trực tiếp tới User Profile API.</p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-blue-300/15 bg-blue-500/[0.055] p-3">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-blue-200/20 bg-[linear-gradient(135deg,#005BFF,#07111F)] text-lg font-black text-white">
            {values.avatarUrl ? (
              <OptimizedImage alt={values.fullName || "Avatar"} className="h-full w-full object-cover" fallbackKind="avatar" sizes="56px" src={values.avatarUrl} />
            ) : (
              getInitials(profile)
            )}
          </div>
          <div>
            <p className="text-sm font-black text-white">Avatar placeholder</p>
            <p className="text-caption text-slate-400">Dùng URL ảnh khi có sẵn</p>
          </div>
        </div>
      </div>

      {error && <ApiErrorAlert className="mt-5" error={error} surface="store" title="Có lỗi hồ sơ" />}

      <form aria-busy={isSavingProfile} className="mt-6 grid gap-5" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field error={visibleErrors.fullName} id="fullName" label="Họ tên" required>
            <Input
              aria-describedby={visibleErrors.fullName ? "fullName-error" : undefined}
              disabled={isSavingProfile}
              error={visibleErrors.fullName}
              id="fullName"
              onBlur={() => handleBlur("fullName")}
              onChange={(event) => handleChange("fullName", event.target.value)}
              placeholder="Nguyễn Văn A"
              value={values.fullName}
            />
          </Field>

          <Field error={visibleErrors.username} id="username" label="Username" required>
            <Input
              aria-describedby={visibleErrors.username ? "username-error" : undefined}
              disabled={isSavingProfile}
              error={visibleErrors.username}
              id="username"
              onBlur={() => handleBlur("username")}
              onChange={(event) => handleChange("username", event.target.value)}
              placeholder="username"
              value={values.username}
            />
          </Field>

          <Field error={visibleErrors.email} id="email" label="Email" required>
            <Input
              aria-describedby={visibleErrors.email ? "email-error" : undefined}
              disabled={isSavingProfile}
              error={visibleErrors.email}
              id="email"
              onBlur={() => handleBlur("email")}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={values.email}
            />
          </Field>

          <Field error={visibleErrors.phoneNumber} id="phoneNumber" label="Số điện thoại" required>
            <Input
              aria-describedby={visibleErrors.phoneNumber ? "phoneNumber-error" : undefined}
              disabled={isSavingProfile}
              error={visibleErrors.phoneNumber}
              id="phoneNumber"
              onBlur={() => handleBlur("phoneNumber")}
              onChange={(event) => handleChange("phoneNumber", event.target.value)}
              placeholder="0901234567"
              value={values.phoneNumber}
            />
          </Field>

          <Field id="gender" label="Giới tính">
            <select
              className="premium-transition h-10 w-full rounded-lg border border-white/10 bg-slate-950/55 px-3 text-sm font-semibold text-white outline-none backdrop-blur-xl focus:border-blue-400/80 focus:shadow-[0_0_34px_rgba(0,91,255,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSavingProfile}
              onChange={(event) => handleChange("gender", event.target.value)}
              value={values.gender}
            >
              <option value="PREFER_NOT_TO_SAY">Không muốn chia sẻ</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </Field>

          <Field id="dateOfBirth" label="Ngày sinh">
            <Input
              disabled={isSavingProfile}
              id="dateOfBirth"
              onChange={(event) => handleChange("dateOfBirth", event.target.value)}
              type="date"
              value={values.dateOfBirth}
            />
          </Field>
        </div>

        <Field id="avatarUrl" label="Avatar URL">
          <Input
            disabled={isSavingProfile}
            id="avatarUrl"
            leftIcon={<Camera size={17} />}
            onChange={(event) => handleChange("avatarUrl", event.target.value)}
            placeholder="https://..."
            value={values.avatarUrl}
          />
        </Field>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <Button className="rounded-2xl" disabled={isSavingProfile} type="submit">
            {isSavingProfile ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />}
            {isSavingProfile ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ProfileSettings;
