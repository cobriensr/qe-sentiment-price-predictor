// src/components/ui/PageHeader.tsx
interface PageHeaderProps {
  readonly title: string
  readonly description?: string
  readonly className?: string
}

export default function PageHeader({ title, description, className = '' }: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  )
}