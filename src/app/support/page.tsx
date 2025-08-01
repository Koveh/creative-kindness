'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function SupportPage() {
  const [frequency, setFrequency] = useState<'monthly' | 'weekly' | 'once'>('monthly')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement form submission
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Image Section */}
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <Skeleton className="w-full h-full" />
        {/* TODO: Replace with actual image */}
        {/* <Image
          src="/support-hero.jpg"
          alt="Люди идут по полю"
          fill
          className="object-cover"
        /> */}
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Мы верим в силу сотрудничества!
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Именно благодаря регулярным взносам мы поддерживаем работу сайта, развиваем команду и финансируем программы фондов. Работая вместе мы сможем значительно ускорить создание полезной социальной платформы.
          </p>
        </div>

        {/* Support Form */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Имя
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Добро Креативное"
                  disabled={isLoading}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Почта
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@societycreate.ru"
                  disabled={isLoading}
                />
              </div>

              {/* Amount Field */}
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Сумма
                </label>
                <Input
                  id="amount"
                  type="text"
                  defaultValue="500₽"
                  className="text-center font-medium"
                  disabled={isLoading}
                />
              </div>

              {/* Frequency Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Тип
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={frequency === 'monthly' ? 'default' : 'outline'}
                    onClick={() => setFrequency('monthly')}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Каждый месяц
                  </Button>
                  <Button
                    type="button"
                    variant={frequency === 'weekly' ? 'default' : 'outline'}
                    onClick={() => setFrequency('weekly')}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Раз в неделю
                  </Button>
                  <Button
                    type="button"
                    variant={frequency === 'once' ? 'default' : 'outline'}
                    onClick={() => setFrequency('once')}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Разово
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    Обработка...
                  </div>
                ) : (
                  'Помочь'
                )}
              </Button>

              {/* Disclaimer */}
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Нажимая на кнопку «Помочь», вы соглашаетесь с условиями оферты, политики в отношении обработки и защиты персональных данных и даёте согласие на обработку персональных данных.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <div className="flex justify-center gap-8 mt-12">
          <a href="#" className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
            telegram →
          </a>
          <a href="#" className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
            вконтакте →
          </a>
          <a href="#" className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
            youtube →
          </a>
          <a href="#" className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
            instagram →
          </a>
        </div>
      </div>
    </div>
  )
}