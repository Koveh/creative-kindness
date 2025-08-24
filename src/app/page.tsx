import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section with Large Image */}
      <section className="w-full mb-6 md:mb-12">
        <Image
          src="/preview_main_page.jpg"
          alt="Креативное добро - главная страница"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          priority
        />
      </section>

      {/* Content Section */}
      <section className="mb-8">
        {/* Title */}
        <h1 className="text-xl md:text-xl lg:text-2xl font-medium mb-3 text-primary leading-tight">
          От безразличия к вовлечению: <br /> как студия «ONY» превратила фонд «ЦМТ» в узнаваемый бренд помощи
        </h1>

        {/* Description Text */}
        <p className="text-base md:text-base text-secondary leading-relaxed max-w-4xl">
          Когда социальная организация годами работает в тени, а общество не замечает её усилий, требуется кардинальный пересмотр коммуникационной стратегии. История сотрудничества креативной студии "ONY" с фондом "ЦМТ" демонстрирует, как правильно выстроенная визуальная коммуникация способна изменить отношение общества к сложной социальной проблеме.
        </p>
      </section>

      {/* Navigation Links */}
      <section className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 md:gap-16">
          <Link 
            href="/journal" 
            className="group flex items-center gap-2 text-lg font-medium text-primary hover:text-secondary transition-colors"
          >
            читать историю
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          
          <Link 
            href="/support" 
            className="group flex items-center gap-2 text-lg font-medium text-primary hover:text-secondary transition-colors"
          >
            поддержать проект
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          
          <Link 
            href="/collaboration" 
            className="group flex items-center gap-2 text-lg font-medium text-primary hover:text-secondary transition-colors"
          >
            сотрудничество
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
