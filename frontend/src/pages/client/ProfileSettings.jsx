import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Camera, Save, UserRound } from "lucide-react";
import { normalizePhoneNumber } from "../../api/accountMapper";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useToast } from "../../components/ui/toast";

const initialValues = {
  avatarUrl: "",
  dateOfBirth: "",
  email: "",
  fullName: "",
  gender: "PREFER_NOT_TO_SAY",
  phoneNumber: "",
  username: "",
};

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

function Field({ error, label, children }) {
  return (
    <div>
      <p className="mb-2 text-sm font-black text-slate-200">{label}</p>
      {children}
      {error && <p className="mt-2 text-xs font-bold text-red-200">{error}</p>}
    </div>
  );
}

function ProfileSettings() {
  const { error, isSavingProfile, profile, updateProfile } = useOutletContext();
  const toast = useToast();
  const [values, setValues] = useState(initialValues);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    setValues(buildFormValues(profile));
  }, [profile]);

  const errors = validateProfile(values);
  const visibleErrors = submitAttempted ? errors : {};

  const handleChange = (fieldName, nextValue) => {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: nextValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(errors).length) {
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
    <section className="rounded-3xl border border-white/10 bg-slate-950/36 p-5 shadow-inner shadow-white/[0.03] backdrop-blur-xl lg:p-6">
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
            {values.avatarUrl ? <img alt={values.fullName || "Avatar"} className="h-full w-full object-cover" src={values.avatarUrl} /> : getInitials(profile)}
          </div>
          <div>
            <p className="text-sm font-black text-white">Avatar placeholder</p>
            <p className="text-caption text-slate-400">Dùng URL ảnh khi có sẵn</p>
          </div>
        </div>
      </div>

      {error && <ApiErrorAlert className="mt-5" error={error} surface="store" title="Có lỗi hồ sơ" />}

      <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field error={visibleErrors.fullName} label="Họ tên">
            <Input
              id="fullName"
              onChange={(event) => handleChange("fullName", event.target.value)}
              placeholder="Nguyễn Văn A"
              value={values.fullName}
            />
          </Field>

          <Field error={visibleErrors.username} label="Username">
            <Input
              id="username"
              onChange={(event) => handleChange("username", event.target.value)}
              placeholder="username"
              value={values.username}
            />
          </Field>

          <Field error={visibleErrors.email} label="Email">
            <Input
              id="email"
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={values.email}
            />
          </Field>

          <Field error={visibleErrors.phoneNumber} label="Số điện thoại">
            <Input
              id="phoneNumber"
              onChange={(event) => handleChange("phoneNumber", event.target.value)}
              placeholder="0901234567"
              value={values.phoneNumber}
            />
          </Field>

          <Field label="Giới tính">
            <select
              className="premium-transition h-10 w-full rounded-lg border border-white/10 bg-slate-950/55 px-3 text-sm font-semibold text-white outline-none backdrop-blur-xl focus:border-blue-400/80 focus:shadow-[0_0_34px_rgba(0,91,255,0.22)]"
              onChange={(event) => handleChange("gender", event.target.value)}
              value={values.gender}
            >
              <option value="PREFER_NOT_TO_SAY">Không muốn chia sẻ</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </Field>

          <Field label="Ngày sinh">
            <Input
              id="dateOfBirth"
              onChange={(event) => handleChange("dateOfBirth", event.target.value)}
              type="date"
              value={values.dateOfBirth}
            />
          </Field>
        </div>

        <Field label="Avatar URL">
          <Input
            id="avatarUrl"
            leftIcon={<Camera size={17} />}
            onChange={(event) => handleChange("avatarUrl", event.target.value)}
            placeholder="https://..."
            value={values.avatarUrl}
          />
        </Field>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <Button className="rounded-2xl" disabled={isSavingProfile} type="submit">
            <Save size={17} />
            {isSavingProfile ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ProfileSettings;
