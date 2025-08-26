import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="w-full">
      {/* Mobile layout: image + sidebar-style navigation below */}
      <div className="md:hidden">
        {/* Main image */}
        <section className="w-full mb-6">
          <Image
            src="/main.png"
            alt="Креативное добро — главная изображение"
            width={1920}
            height={1080}
            className="w-full h-auto object-cover"
            priority
          />
        </section>

        {/* Sidebar-like navigation */}
        <nav className="flex flex-col items-start gap-[10px] px-4 pb-8">
          {/* Active item with arrow icon to the left */}
          <Link href="/" className="relative block pl-[90px] text-[36px] font-medium leading-tight my-[10px]">
            <Image src="/Vector.svg" alt="Креативное добро" width={80} height={75} className="absolute left-0 top-1/2 -translate-y-1/2" />
            <span className="leading-tight">
              <span className="block">креативное</span>
              <span className="block">добро</span>
            </span>
          </Link>

          {/* Other items */}
          <Link href="/journal" className="block pl-[90px] text-[21px] whitespace-nowrap">журнал</Link>
          <Link href="/creators" className="block pl-[90px] text-[21px] whitespace-nowrap">креаторы</Link>
          <Link href="/teams" className="block pl-[90px] text-[21px] whitespace-nowrap">команды</Link>
          <Link href="/support" className="block pl-[90px] text-[21px] whitespace-nowrap">поддержать нас</Link>
          <Link href="/collaboration" className="block pl-[90px] text-[21px] whitespace-nowrap">сотрудничество</Link>
          <Link href="/about" className="block pl-[90px] text-[21px] whitespace-nowrap">о проекте</Link>
        </nav>
      </div>

      {/* Desktop/Tablet content remains unchanged */}
      <div className="hidden md:block">
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
        <section className="mb-0">
          {/* Title */}
          <h1 className="text-xl md:text-xl lg:text-[32px] font-medium mb-[10px] text-primary leading-tight">
            От безразличия к вовлечению: <br /> как студия «ONY» превратила фонд «ЦМТ» в узнаваемый бренд помощи
          </h1>
          
          {/* Description Text */}
          <p className="text-base md:text-base lg:text-[20px] text-secondary leading-relaxed max-w-4xl">
            Когда социальная организация годами работает в тени, а общество не замечает её усилий, требуется кардинальный пересмотр коммуникационной стратегии. История сотрудничества креативной студии "ONY" с фондом "ЦМТ" демонстрирует, как правильно выстроенная визуальная коммуникация способна изменить отношение общества к сложной социальной проблеме.
          </p>
        </section>
      </div>

      {/* Navigation Links */}
      <section className="hidden md:block mb-6 mt-[10px]">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 md:gap-16">
          <Link 
            href="/journal" 
            className="group flex items-center gap-2 text-lg lg:text-[20px] font-medium text-primary hover:text-secondary transition-colors"
          >
            читать историю
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          
          {/* <Link 
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
          </Link> */}
        </div>
      </section>
    </div>
  )
}
