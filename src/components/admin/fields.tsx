// Field form admin sederhana (tanpa state, bisa dipakai di server component).

const inputClass = "adm-input";

type Base = { label: string; name: string; hint?: string; required?: boolean };

function Label({ label, htmlFor, required }: { label: string; htmlFor: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-gray-800">
      {label}
      {required && <span className="text-red-600"> *</span>}
    </label>
  );
}

function Hint({ text }: { text?: string }) {
  return text ? <p className="mt-1 text-xs text-gray-500">{text}</p> : null;
}

export function TextField({
  label,
  name,
  hint,
  required,
  defaultValue,
  type = "text",
  ...rest
}: Base & { defaultValue?: string | number | null; type?: string } & Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "defaultValue" | "name" | "type"
  >) {
  const id = `f-${name}`;
  return (
    <div>
      <Label label={label} htmlFor={id} required={required} />
      <input id={id} name={name} type={type} required={required} defaultValue={defaultValue ?? ""} className={inputClass} {...rest} />
      <Hint text={hint} />
    </div>
  );
}

export function TextArea({
  label,
  name,
  hint,
  required,
  defaultValue,
  rows = 4,
}: Base & { defaultValue?: string | null; rows?: number }) {
  const id = `f-${name}`;
  return (
    <div>
      <Label label={label} htmlFor={id} required={required} />
      <textarea id={id} name={name} rows={rows} required={required} defaultValue={defaultValue ?? ""} className={inputClass} />
      <Hint text={hint} />
    </div>
  );
}

export function Checkbox({ label, name, defaultChecked, hint }: Omit<Base, "required"> & { defaultChecked?: boolean }) {
  return (
    <div>
      <label className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-[18px] w-[18px] rounded accent-[#45593c]" />
        {label}
      </label>
      <Hint text={hint} />
    </div>
  );
}

export function Select({
  label,
  name,
  hint,
  required,
  defaultValue,
  options,
}: Base & { defaultValue?: string; options: { value: string; label: string }[] }) {
  const id = `f-${name}`;
  return (
    <div>
      <Label label={label} htmlFor={id} required={required} />
      <select id={id} name={name} required={required} defaultValue={defaultValue} className={inputClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Hint text={hint} />
    </div>
  );
}

export function ColorField({ label, name, defaultValue }: Omit<Base, "required"> & { defaultValue?: string | null }) {
  const id = `f-${name}`;
  return (
    <div>
      <Label label={label} htmlFor={id} />
      <input id={id} name={name} type="color" defaultValue={defaultValue ?? "#000000"} className="h-11 w-20 cursor-pointer rounded-xl border border-gray-300 bg-white p-1" />
    </div>
  );
}

export function Card({ title, children, actions }: { title?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="adm-light adm-card">
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-lg font-bold tracking-tight">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

/** Kelompok field dalam satu form, dengan judul kecil & garis pemisah. */
export function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    // first-of-type, bukan first: server action menyisipkan <input hidden> di awal form.
    <fieldset className="space-y-4 border-t border-gray-100 pt-6 first-of-type:border-0 first-of-type:pt-0">
      <legend className="sr-only">{title}</legend>
      <div aria-hidden>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-600">{title}</p>
        {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
      </div>
      {children}
    </fieldset>
  );
}

const NOTICE_TONE = {
  info: "border-[#c9ccbc] bg-[#e3e6d4] text-[#26291f]",
  warn: "border-[#efd393] bg-[#f6e3b8] text-[#3d2f0c]",
  muted: "border-[#c9ccbc] bg-[#eef0e2] text-[#3a3f36]",
};

/** Kotak catatan (mis. "bagian ini diatur di kode"). */
export function Notice({
  tone = "info",
  title,
  children,
}: {
  tone?: keyof typeof NOTICE_TONE;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="note" className={`rounded-[20px] border px-4 py-3 text-sm leading-relaxed ${NOTICE_TONE[tone]}`}>
      {title && <p className="font-semibold">{title}</p>}
      <div className={title ? "mt-1 space-y-1" : "space-y-1"}>{children}</div>
    </div>
  );
}

/** Judul halaman + aksi di kanan (tombol tambah, dll). */
export function PageHeader({ title, description, actions }: { title: string; description?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="adm-title">{title}</h1>
        {description && <p className="mt-2 text-[15px] text-[#d4dcc8]">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function PublishBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="rounded-full bg-[#dcebcb] px-2.5 py-1 text-xs font-bold text-[#1f3a14]">Tayang</span>
  ) : (
    <span className="rounded-full bg-[#e4e5dd] px-2.5 py-1 text-xs font-bold text-[#3a3f36]">Draft</span>
  );
}
