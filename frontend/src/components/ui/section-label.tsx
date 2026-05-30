interface Props {
  children: React.ReactNode
}

export default function SectionLabel({ children }: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] tracking-[0.2em] uppercase text-[#A44A3F] font-sans font-bold">
        {children}
      </label>

      <div className="h-px w-12 bg-[#A44A3F]/20" />
    </div>
  )
}