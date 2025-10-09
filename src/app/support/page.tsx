'use client'

import { useState } from 'react'
import Image from 'next/image'
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
    <div className="w-full">
      {/* Full-width hero image */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 xl:h-120 mb-4 md:mb-8">
        <Image
          src="/support_us.webp"
          alt="Поддержка Креативного добра"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Section */}
      <div className="max-w-4xl">
        {/* Heading */}
        <div className="text-left mb-8">
          <h1 className="text-xl md:text-[32px] font-bold mb-2">
            Мы верим в силу сотрудничества!
          </h1>
          <p className="text-base md:text-[20px] text-secondary max-w-3xl leading-relaxed">
            Именно благодаря регулярным взносам мы поддерживаем работу сайта, развиваем команду и финансируем программы фондов. Работая вместе мы сможем значительно ускорить создание полезной социальной платформы.
          </p>
        </div>

        {/* Support Form */}
        <div className="text-left mb-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-y-[25px] gap-x-[25px] md:gap-x-[50px]">
            {/* Name Field */}
            <label htmlFor="name" className="text-[20px] font-medium whitespace-nowrap md:col-span-1">
              Имя →
            </label>
            <div className="relative md:col-span-3">
              <Input
                id="name"
                type="text"
                placeholder="Добро Креативное"
                className="w-full border-none bg-white text-[#B5B5B5] placeholder:text-[#B5B5B5] focus:outline-none focus:ring-0 pb-2 text-[20px]"
                disabled={isLoading}
              />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B5B5B5]"></div>
            </div>

            {/* Email Field */}
            <label htmlFor="email" className="text-[20px] font-medium whitespace-nowrap md:col-span-1">
              Почта →
            </label>
            <div className="relative md:col-span-3">
              <Input
                id="email"
                type="email"
                placeholder="hello@societycreate.ru"
                className="w-full border-none bg-white text-[#B5B5B5] placeholder:text-[#B5B5B5] focus:outline-none focus:ring-0 pb-2 text-[20px]"
                disabled={isLoading}
              />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B5B5B5]"></div>
            </div>

            {/* Amount Field */}
            <label htmlFor="amount" className="text-[20px] font-medium whitespace-nowrap md:col-span-1">
              Сумма →
            </label>
            <div className="relative md:col-span-3">
              <Input
                id="amount"
                type="text"
                defaultValue="500₽"
                className="w-full border border-[#B5B5B5] bg-transparent text-center font-medium text-[20px]"
                disabled={isLoading}
              />
            </div>

            {/* Frequency Selection */}
            <label className="text-[20px] font-medium md:whitespace-nowrap md:col-span-1">
              Тип →
            </label>
            <div className="flex flex-col md:flex-row gap-2 md:col-span-3">
              <Button
                type="button"
                variant={frequency === 'monthly' ? 'default' : 'outline'}
                onClick={() => setFrequency('monthly')}
                disabled={isLoading}
                className="flex-1 text-[20px]"
              >
                Каждый месяц
              </Button>
              <Button
                type="button"
                variant={frequency === 'weekly' ? 'default' : 'outline'}
                onClick={() => setFrequency('weekly')}
                disabled={isLoading}
                className="flex-1 text-[20px]"
              >
                Каждую неделю
              </Button>
              <Button
                type="button"
                variant={frequency === 'once' ? 'default' : 'outline'}
                onClick={() => setFrequency('once')}
                disabled={isLoading}
                className="flex-1 text-[20px]"
              >
                Разово
              </Button>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-4 flex justify-left pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-8 text-lg font-medium bg-black hover:bg-primary/90 text-white text-left"
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
            </div>

            {/* Disclaimer */}
            <p className="md:col-span-4 text-base text-[#B5B5B5] text-left">
              Нажимая на кнопку «Помочь», вы соглашаетесь с условиями оферты, политики в отношении обработки и защиты персональных данных и даёте согласие на обработку персональных данных.
            </p>
          </form>
        </div>

        {/* Social Media Links */}
        {/* <div className="flex justify-between">
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
        </div> */}
      </div>
    </div>
  )
}