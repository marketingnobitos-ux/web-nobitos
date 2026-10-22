// Field form admin sederhana (tanpa state, bisa dipakai di server component).

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900";

type Base = { label: string; name: string; hint?: string; required?: boolean };

function Label({ label, htmlFor, required }: { label: string; htmlFor: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700">
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
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 rounded border-gray-300" />
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
      <input id={id} name={name} type="color" defaultValue={defaultValue ?? "#000000"} className="h-10 w-20 cursor-pointer rounded border border-gray-300" />
    </div>
  );
}

export function Card({ title, children, actions }: { title?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
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
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</p>
        {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
      </div>
      {children}
    </fieldset>
  );
}

const NOTICE_TONE = {
  info: "border-sky-200 bg-sky-50 text-sky-900",
  warn: "border-amber-200 bg-amber-50 text-amber-900",
  muted: "border-gray-200 bg-gray-50 text-gray-700",
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
    <div role="note" className={`rounded-lg border px-4 py-3 text-sm ${NOTICE_TONE[tone]}`}>
      {title && <p className="font-semibold">{title}</p>}
      <div className={title ? "mt-1 space-y-1" : "space-y-1"}>{children}</div>
    </div>
  );
}

/** Judul halaman + aksi di kanan (tombol tambah, dll). */
export function PageHeader({ title, description, actions }: { title: string; description?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function PublishBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Tayang</span>
  ) : (
    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Draft</span>
  );
}
