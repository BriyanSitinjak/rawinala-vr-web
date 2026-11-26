import { siteContent, t } from "@/content/tour";
import { focusRing } from "@/lib/styles";

export function Footer() {
  const { contactHeading, address, phone, email, note } = siteContent.footer;

  return (
    <footer className="bg-[var(--color-forest-deep)] px-6 py-14 text-[var(--color-cream)] sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl">
            {siteContent.home.brandName}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[color-mix(in_srgb,var(--color-cream)_75%,transparent)]">
            {t(note)}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-sun)]">
            {t(contactHeading)}
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[color-mix(in_srgb,var(--color-cream)_88%,transparent)]">
            <li>{t(address)}</li>
            <li>
              <a
                href={`tel:${t(phone).replace(/\s/g, "")}`}
                className={`underline-offset-4 hover:underline ${focusRing.sun}`}
              >
                {t(phone)}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${t(email)}`}
                className={`underline-offset-4 hover:underline ${focusRing.sun}`}
              >
                {t(email)}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
