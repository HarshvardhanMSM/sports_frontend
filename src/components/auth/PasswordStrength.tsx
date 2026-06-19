"use client";

interface PasswordStrengthProps {
  password: string;
}

interface Rule {
  label: string;
  test: (p: string) => boolean;
}

const rules: Rule[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Number", test: (p) => /\d/.test(p) },
  { label: "Special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password: string): { score: number; label: string; color: string; bg: string } {
  const passed = rules.filter((r) => r.test(password)).length;
  if (password.length === 0) return { score: 0, label: "", color: "", bg: "" };
  if (passed <= 2) return { score: 1, label: "Weak", color: "text-rose-600", bg: "bg-rose-500" };
  if (passed <= 3) return { score: 2, label: "Fair", color: "text-amber-600", bg: "bg-amber-500" };
  if (passed <= 4) return { score: 3, label: "Good", color: "text-yellow-600", bg: "bg-yellow-500" };
  return { score: 4, label: "Strong", color: "text-emerald-600", bg: "bg-emerald-500" };
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2.5 space-y-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
      {/* Strength bar */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 flex gap-1 h-1.5">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`flex-1 rounded-full transition-all duration-300 ${
                level <= strength.score ? strength.bg : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        {strength.label && (
          <span className={`text-xs font-semibold ${strength.color} min-w-[40px] text-right`}>
            {strength.label}
          </span>
        )}
      </div>

      {/* Rules */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {rules.map((rule) => {
          const passed = rule.test(password);
          return (
            <div
              key={rule.label}
              className={`flex items-center gap-1.5 text-xs transition-colors duration-150 ${
                passed ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              <div className={`size-1.5 rounded-full shrink-0 transition-colors duration-150 ${passed ? "bg-emerald-500" : "bg-slate-300"}`} />
              {rule.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
