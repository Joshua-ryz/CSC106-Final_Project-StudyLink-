/**
 * BrandPanel Component
 * NFR-004 NFR-005 NFR-011 references
 */

import { BookOpen, Users, Sparkles, GraduationCap, Target } from 'lucide-react'
import { cn } from '@/utils'

interface FloatingShape {
  top?: string
  bottom?: string
  left?: string
  right?: string
  size: string
  delay: string
  color: string
}

const floating_shapes: FloatingShape[] = [
  { top: '10%', left: '10%', size: 'w-24 h-24', delay: '0s', color: 'bg-sl-accent-primary/20' },
  { top: '20%', right: '15%', size: 'w-16 h-16', delay: '2s', color: 'bg-sl-accent-secondary/20' },
  { bottom: '30%', left: '20%', size: 'w-20 h-20', delay: '4s', color: 'bg-sl-accent-primary/15' },
  { bottom: '15%', right: '10%', size: 'w-12 h-12', delay: '6s', color: 'bg-sl-accent-secondary/15' },
  { top: '50%', left: '5%', size: 'w-8 h-8', delay: '1s', color: 'bg-sl-accent-primary/10' },
  { top: '60%', right: '5%', size: 'w-10 h-10', delay: '3s', color: 'bg-sl-accent-secondary/10' },
]

const features = [
  { icon: GraduationCap, title: 'Peer Learning', desc: 'Connect with fellow CSU students who understand your courses' },
  { icon: Users, title: 'CSU Tutors', desc: 'All tutors are verified CSU students with proven expertise' },
  { icon: Target, title: 'Flexible Sessions', desc: 'Schedule sessions that fit your availability and learning pace' },
  { icon: Sparkles, title: 'Track Progress', desc: 'Monitor your learning journey with session history and feedback' },
] as const

export function BrandPanel() {
  return (
    <aside className="brand_panel" aria-hidden="true">
      <div className="floating_shapes" aria-hidden="true">
        {floating_shapes.map((shape, index) => (
        <div
                key={index}
                className={cn('shape rounded-full', shape.size, shape.color)}
              style={{
                top: shape.top,
                bottom: shape.bottom,
                left: shape.left,
                right: shape.right,
                animationDelay: shape.delay,
              }}
            />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto text-center px-8">
        {/* Logo */}
        <div className="mb-10 animate-in slide-up flex-shrink-0" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-sl-accent-primary to-sl-accent-secondary mb-6 shadow-glow-primary float-logo">
              <BookOpen className="w-10 h-10 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-sl-text-primary tracking-tight">
            StudyLink
          </h1>
          <p className="mt-3 text-lg lg:text-xl text-sl-text-secondary font-medium">
            Peer Tutoring for CSU Students
        </p>
        </div>

        {/* Tagline */}
        <div className="mb-10 animate-in slide-up flex-shrink-0" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-sl-bg-input/50 border border-sl-border/50 rounded-full">
            <Sparkles className="w-5 h-5 text-sl-accent-primary" aria-hidden="true" />
            <span className="text-sl-text-primary font-medium text-lg">"Learn Together. Grow Together."</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 animate-in slide-up flex-shrink-0" style={{ animationDelay: '0.3s' }}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'text-left p-5 bg-sl-bg-card/50 border border-sl-border/50 rounded-xl backdrop-blur-sm',
                'transition-all duration-300',
                'hover:-translate-y-1 hover:border-sl-accent-primary/50 hover:shadow-glow-primary',
                'focus-within:ring-2 focus-within:ring-sl-accent-primary focus-within:ring-offset-2 focus-within:ring-offset-sl-bg-main'
              )}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              tabIndex={0}
              role="article"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sl-accent-primary/10 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-sl-accent-primary/20">
                <feature.icon className="w-6 h-6 text-sl-accent-primary transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-sl-text-primary mb-1">{feature.title}</h3>
              <p className="text-sm text-sl-text-secondary">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* University attribution */}
        <div className="mt-10 animate-in slide-up flex-shrink-0" style={{ animationDelay: '0.5s' }}>
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-sl-bg-input/30 border border-sl-border/30 rounded-xl">
            <GraduationCap className="w-5 h-5 text-sl-accent-secondary" aria-hidden="true" />
            <span className="text-sm text-sl-text-secondary">
              Caraga State University
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}