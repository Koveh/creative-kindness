import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Team {
  name: string
  category: string
  image: string
  description: string
  link?: string
}

const teams: Team[] = [
  {
    name: 'Креативная студия «ONY»',
    category: 'Дизайн-студия',
    image: 'http://65.109.88.77:9000/creative-kindness/person_6.jpg',
    description:
      'Специализируется на создании визуальной идентичности для социальных проектов и благотворительных организаций.',
    link: '#',
  },
  {
    name: 'Фонд «Центр медицинских технологий»',
    category: 'Благотворительный фонд',
    image: 'http://65.109.88.77:9000/creative-kindness/person_2.jpg',
    description:
      'Помогает людям с редкими заболеваниями получить доступ к современному лечению и медицинским технологиям.',
    link: '#',
  },
  {
    name: 'Студия социальной рекламы',
    category: 'Рекламное агентство',
    image: 'http://65.109.88.77:9000/creative-kindness/person_3.jpg',
    description: 'Создает эффективные рекламные кампании для привлечения внимания к социальным проблемам.',
    link: '#',
  },
  {
    name: 'Экологическая инициатива «Зеленый город»',
    category: 'Экологическая организация',
    image: 'http://65.109.88.77:9000/creative-kindness/person_4.jpg',
    description: 'Занимается озеленением городских пространств и экологическим просвещением населения.',
    link: '#',
  },
  {
    name: 'Центр помощи детям «Надежда»',
    category: 'Детский фонд',
    image: 'http://65.109.88.77:9000/creative-kindness/person_5.jpg',
    description:
      'Оказывает комплексную поддержку детям из неблагополучных семей и детям-сиротам.',
    link: '#',
  },
  {
    name: 'IT-волонтеры «Цифровое добро»',
    category: 'IT-сообщество',
    image: 'http://65.109.88.77:9000/creative-kindness/Daniil_Kovekh.jpeg',
    description:
      'Разрабатывает цифровые решения для НКО и помогает автоматизировать процессы в благотворительности.',
    link: '#',
  },
]

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zа-я0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export default function TeamSlugPage({ params }: { params: { slug: string } }) {
  const team = teams.find((t) => slugify(t.name) === params.slug)
  if (!team) notFound()

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] lg:gap-[50px]">
        {/* Left 1/3: details */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-[24px] lg:text-[32px] font-medium text-primary leading-tight line-clamp-2">
              {team.name}
            </h1>
            {team.link && (
              <Link href={team.link} className="text-primary hover:text-secondary text-[24px] lg:text-[32px]" aria-label="Перейти по ссылке">
                ↗
              </Link>
            )}
          </div>
          <h2 className="text-[20px] lg:text-[24px] text-secondary mb-3 leading-snug line-clamp-2">{team.category}</h2>
          <p className="text-[16px] lg:text-[20px] text-primary leading-relaxed">
            {team.description}
          </p>
        </div>

        {/* Right 2/3: image with overlay like teams grid */}
        <div className="lg:col-span-2">
          <div className="group relative w-full overflow-hidden rounded-none" style={{ aspectRatio: '391/466' }}>
            <Image src={team.image} alt={team.name} fill className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-3 lg:p-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-2 text-white text-[12px] lg:text-[20px]">
                <span className="truncate">{team.name}</span>
                <span>→</span>
              </div>
              <div className="text-[#B5B5B5] text-[12px] lg:text-[20px] leading-snug line-clamp-2">
                {team.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


