import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Full-size image with 1464:689 aspect ratio */}
      <div className="relative w-full aspect-[1464/689] max-h-screen mb-12">
        <Image
          src="http://65.109.88.77:9000/creative-kindness/about.png"
          alt="О платформе Креативное добро"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content grid: about and contacts */}
      <div className="w-full max-w-none">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-8 lg:gap-12 w-full">
          {/* About section */}
          <div className="md:col-span-3 lg:col-span-2 xl:col-span-3">
            <section>
              <h1 className="text-[32px] font-medium text-primary mb-6">
                Креативное добро — медиа-платформа нового поколения
              </h1>
              
              <div className="space-y-4 text-[20px] leading-relaxed">
                <p className="text-secondary">
                  Мы объединяем благотворительные фонды и креаторов для создания социально значимого контента, который меняет отношение общества к благотворительности. Превращаем социальную ответственность в инструмент профессионального развития и общественного воздействия.
                </p>
                
                <p className="text-secondary">
                  Помогаем фондам получать качественную креативную поддержку через систему наставничества и экспертизы. Талантливые специалисты работают над реальными проектами под руководством признанных экспертов рынка, создавая контент, который привлекает внимание к важным социальным проблемам.
                </p>
              </div>
            </section>
          </div>

          {/* Contacts section */}
          <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
            <section>
              <h2 className="text-[32px] font-medium text-primary mb-4">
                Контакты
              </h2>
              
              <div className="space-y-2">
                <Link 
                  href="https://t.me/creativekindness" 
                  className="block text-secondary hover:text-primary transition-colors text-[20px]"
                >
                  telegram →
                </Link>
                
                <Link 
                  href="https://vk.com/creativekindness" 
                  className="block text-secondary hover:text-primary transition-colors text-[20px]"
                >
                  вконтакте →
                </Link>
                
                <Link 
                  href="https://youtube.com/@creativekindness" 
                  className="block text-secondary hover:text-primary transition-colors text-[20px]"
                >
                  youtube →
                </Link>
                
                <Link 
                  href="https://instagram.com/creativekindness" 
                  className="block text-secondary hover:text-primary transition-colors text-[20px]"
                >
                  instagram →
                </Link>
                
                <Link 
                  href="tel:+79158991215" 
                  className="block text-secondary hover:text-primary transition-colors text-[20px]"
                >
                  +7 (915) 899-12-15 →
                </Link>
                
                <Link 
                  href="mailto:societycreate@yandex.ru" 
                  className="block text-secondary hover:text-primary transition-colors text-[20px]"
                >
                  societycreate@yandex.ru →
                </Link>
                
                <Link 
                  href="https://koveh.com" 
                  className="block text-secondary hover:text-primary transition-colors text-[20px]"
                >
                  разработка сайта → koveh.com
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}