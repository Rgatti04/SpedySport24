import { Check, ChevronDown } from 'lucide-react'
import { useCallback, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useDebouncedInput } from '@/lib/hooks'
import type { NumberRange } from '@/types'

export function FilterSection({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group/section border-b border-slate-200 py-4 first:pt-0 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-md text-sm font-bold text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          aria-hidden="true"
          className="size-4.5 shrink-0 text-slate-400 transition group-open/section:rotate-180"
        />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  )
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

function Count({ value }: { value: number | undefined }) {
  if (value === undefined) return null
  return <span className="ml-auto pl-2 text-xs font-medium tabular-nums text-slate-400">{value}</span>
}

/** Scelta singola resa come chip, con veri radio button (frecce da tastiera incluse). */
export function ChoiceChips({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string
  legend: string
  options: readonly FilterOption[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-300 transition hover:ring-brand-400 peer-checked:bg-brand-700 peer-checked:text-white peer-checked:ring-brand-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600">
              {option.label}
              {option.count !== undefined && (
                <span className="text-xs tabular-nums opacity-70">{option.count}</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function CheckboxList({
  legend,
  options,
  selected,
  onToggle,
  initialVisible,
}: {
  legend: string
  options: readonly FilterOption[]
  selected: readonly string[]
  onToggle: (value: string) => void
  /** Oltre questa soglia le opzioni si espandono con "Mostra tutte". */
  initialVisible?: number
}) {
  const [expanded, setExpanded] = useState(false)
  const limit = initialVisible && !expanded ? initialVisible : options.length
  const visible = options.slice(0, limit)

  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <ul className="space-y-0.5">
        {visible.map((option) => {
          const checked = selected.includes(option.value)
          return (
            <li key={option.value}>
              <label className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100">
                <input type="checkbox" checked={checked} onChange={() => onToggle(option.value)} className="peer sr-only" />
                <span
                  aria-hidden="true"
                  className="grid size-5 shrink-0 place-items-center rounded-md border border-slate-300 bg-white text-white transition peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600"
                >
                  <Check className={cn('size-3.5', !checked && 'invisible')} strokeWidth={3.5} />
                </span>
                <span className={cn('min-w-0', checked && 'font-semibold text-ink')}>{option.label}</span>
                <Count value={option.count} />
              </label>
            </li>
          )
        })}
      </ul>
      {initialVisible !== undefined && options.length > initialVisible && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 rounded-md px-2 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          {expanded ? 'Mostra meno' : `Mostra tutte (${options.length})`}
        </button>
      )}
    </fieldset>
  )
}

const INPUT_CLASSES =
  'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15'

function parseNumber(raw: string): number | null {
  const normalized = raw.replace(',', '.').trim()
  if (!normalized) return null
  const value = Number(normalized)
  return Number.isFinite(value) && value >= 0 ? value : null
}

function NumberField({
  id,
  label,
  value,
  placeholder,
  unit,
  onCommit,
}: {
  id: string
  label: string
  value: number | null
  placeholder?: string
  unit?: string
  onCommit: (value: number | null) => void
}) {
  const commit = useCallback((raw: string) => onCommit(parseNumber(raw)), [onCommit])
  const [draft, setDraft] = useDebouncedInput(value === null ? '' : String(value), commit, 400)

  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-500">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          className={cn(INPUT_CLASSES, unit && 'pr-9')}
        />
        {unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

export function RangeFields({
  idPrefix,
  legend,
  value,
  unit,
  placeholders,
  onChange,
}: {
  idPrefix: string
  legend: string
  value: NumberRange
  unit?: string
  placeholders?: { min?: string; max?: string }
  onChange: (value: NumberRange) => void
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="flex items-end gap-2">
        <NumberField
          id={`${idPrefix}-min`}
          label="Da"
          value={value.min}
          unit={unit}
          placeholder={placeholders?.min ?? 'Min'}
          onCommit={(min) => onChange({ ...value, min })}
        />
        <span className="pb-2.5 text-slate-400" aria-hidden="true">
          –
        </span>
        <NumberField
          id={`${idPrefix}-max`}
          label="A"
          value={value.max}
          unit={unit}
          placeholder={placeholders?.max ?? 'Max'}
          onCommit={(max) => onChange({ ...value, max })}
        />
      </div>
    </fieldset>
  )
}

export function TextFilterField({
  id,
  label,
  value,
  placeholder,
  onCommit,
  list,
}: {
  id: string
  label: string
  value: string
  placeholder?: string
  onCommit: (value: string) => void
  list?: string
}) {
  const [draft, setDraft] = useDebouncedInput(value, onCommit)
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-500">
        {label}
      </label>
      <input
        id={id}
        type="text"
        list={list}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={INPUT_CLASSES}
      />
    </div>
  )
}

/** Interruttore a chip (aria-pressed) per le scelte rapide sopra i risultati. */
export function ToggleChip({
  pressed,
  onClick,
  children,
  count,
}: {
  pressed: boolean
  onClick: () => void
  children: ReactNode
  count?: number
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition',
        pressed
          ? 'bg-brand-700 text-white ring-brand-700'
          : 'bg-white text-slate-700 ring-slate-300 hover:text-brand-700 hover:ring-brand-400',
      )}
    >
      {children}
      {count !== undefined && <span className="text-xs font-medium tabular-nums opacity-70">{count}</span>}
    </button>
  )
}
