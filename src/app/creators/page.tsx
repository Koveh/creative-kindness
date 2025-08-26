import Image from 'next/image'
import Link from 'next/link'

const creators = [
  {
    id: 2,
    name: 'Федор Шубочкин',
    role: 'Креативное Добро',
    image: 'http://65.109.88.77:9000/creative-kindness/Fedor_Shubochkin.jpg',
    description: 'Писатель, редактор, креативный директор. Работает с маркетингом и креативными проектами.'
  },
  {
    id: 1,
    name: 'Даниил Ковех',
    role: 'Студия Koveh.com',
    image: 'http://65.109.88.77:9000/creative-kindness/Daniil_Kovekh.jpeg',
    description: 'Разработчик, пишет информативные статьи для интересующихся айти, финансами и строительством.'
  },
  {
    id: 3,
    name: 'Анна Лебедева',
    role: 'Студия Лебедева',
    image: 'http://65.109.88.77:9000/creative-kindness/person_2.jpg',
    description: 'Дизайнер, создает визуальные решения для социальных проектов и НКО.'
  },
  {
    id: 4,
    name: 'Михаил Соколов',
    role: 'Bureau.ru',
    image: 'http://65.109.88.77:9000/creative-kindness/person_3.jpg',
    description: 'Дизайнер, создает визуальные решения для социальных проектов и НКО.'
  },
  {
    id: 5,
    name: 'Елена Васильева',
    role: 'Студия Reklama',
    image: 'http://65.109.88.77:9000/creative-kindness/person_4.jpg',
    description: 'Писатель, редактор, креативный директор. Работает с маркетингом и креативными проектами.'
  },
  {
    id: 6,
    name: 'Александр Новиков',
    role: 'Студия Reklama',
    image: 'http://65.109.88.77:9000/creative-kindness/person_5.jpg',
    description: 'Дизайнер, создает визуальные решения для социальных проектов и НКО.'
  }
]

export default function CreatorsPage() {
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zа-я0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[25px] md:gap-[50px]">
        {creators.map((creator) => (
          <div key={creator.id} className="group">
            <Link href={`/creators/${slugify(creator.name)}`} className="block">
              <div className="relative w-full overflow-hidden rounded-none" style={{ aspectRatio: '391/466' }}>
                <Image
                  src={creator.image}
                  alt={creator.name}
                  fill
                  className="object-cover"
                />
                {/* Overlay: visible on mobile, on hover on larger screens */}
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-2 text-white text-[12px] md:text-[20px]">
                    <span className="truncate">{creator.name}</span>
                    <span>→</span>
                  </div>
                  <div className="text-[#B5B5B5] text-[12px] md:text-[20px] leading-snug">
                    {creator.description}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}