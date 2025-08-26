import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Creator {
  name: string
  role: string
  image: string
  description: string
  link?: string
}

const creators: Creator[] = [
  {
    name: 'Федор Шубочкин',
    role: 'Креативное Добро',
    image: 'http://65.109.88.77:9000/creative-kindness/Fedor_Shubochkin.jpg',
    description:
      'Писатель, редактор, креативный директор. Работает с маркетингом и креативными проектами.',
    link: '#',
  },
  {
    name: 'Даниил Ковех',
    role: 'Студия Koveh.com',
    image: 'http://65.109.88.77:9000/creative-kindness/Daniil_Kovekh.jpeg',
    description:
      'Разработчик, пишет информативные статьи для интересующихся айти, финансами и строительством.',
    link: '#',
  },
  {
    name: 'Анна Лебедева',
    role: 'Студия Лебедева',
    image: 'http://65.109.88.77:9000/creative-kindness/person_2.jpg',
    description: 'Дизайнер, создает визуальные решения для социальных проектов и НКО.',
    link: '#',
  },
  {
    name: 'Михаил Соколов',
    role: 'Bureau.ru',
    image: 'http://65.109.88.77:9000/creative-kindness/person_3.jpg',
    description: 'Дизайнер, создает визуальные решения для социальных проектов и НКО.',
    link: '#',
  },
  {
    name: 'Елена Васильева',
    role: 'Студия Reklama',
    image: 'http://65.109.88.77:9000/creative-kindness/person_4.jpg',
    description:
      'Писатель, редактор, креативный директор. Работает с маркетингом и креативными проектами.',
    link: '#',
  },
  {
    name: 'Александр Новиков',
    role: 'Студия Reklama',
    image: 'http://65.109.88.77:9000/creative-kindness/person_5.jpg',
    description: 'Дизайнер, создает визуальные решения для социальных проектов и НКО.',
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

export default function CreatorSlugPage({ params }: { params: { slug: string } }) {
  const creator = creators.find((c) => slugify(c.name) === params.slug)
  if (!creator) notFound()

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] lg:gap-[50px]">
        {/* Left 1/3: details */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-[24px] lg:text-[32px] font-medium text-primary leading-tight line-clamp-2">
              {creator.name}
            </h1>
            {creator.link && (
              <Link href={creator.link} className="text-primary hover:text-secondary text-[24px] lg:text-[32px]" aria-label="Перейти по ссылке">
                ↗
              </Link>
            )}
          </div>
          <h2 className="text-[20px] lg:text-[24px] text-secondary mb-3 leading-snug line-clamp-2">{creator.role}</h2>
          <p className="text-[16px] lg:text-[20px] text-primary leading-relaxed">
            {creator.description}
          </p>
        </div>

        {/* Right 2/3: image with overlay like creators grid */}
        <div className="lg:col-span-2">
          <div className="group relative w-full overflow-hidden rounded-none" style={{ aspectRatio: '391/466' }}>
            <Image src={creator.image} alt={creator.name} fill className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-3 lg:p-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-2 text-white text-[12px] lg:text-[20px]">
                <span className="truncate">{creator.name}</span>
                <span>→</span>
              </div>
              <div className="text-[#B5B5B5] text-[12px] lg:text-[20px] leading-snug line-clamp-2">
                {creator.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


