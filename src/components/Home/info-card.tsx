import type { ComponentType } from 'react'

interface InfoCardProps {
  title: string
  content: string
  Icon: ComponentType<{ size?: number; color?: string }>
  color: string
  bg: string
}

export function InfoCard({ title, content, Icon, color, bg }: InfoCardProps) {
  return (
    <div className="flex gap-md items-start bg-white rounded-lg border border-black/7 p-3.5 mb-2.5">
      <div className="w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
        <Icon size={20} color={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#2d2d2d] mb-1">{title}</p>
        <p className="text-[12px] text-[#888] leading-[18px]">{content}</p>
      </div>
    </div>
  )
}
