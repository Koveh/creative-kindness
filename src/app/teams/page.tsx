import Image from 'next/image'
import Link from 'next/link'

const teams = [
  {
    id: 1,
    name: 'Креативная студия «ONY»',
    category: 'Дизайн-студия',
    image: 'http://65.109.88.77:9000/creative-kindness/person_6.jpg',
    description: 'Специализируется на создании визуальной идентичности для социальных проектов и благотворительных организаций.',
  },
  {
    id: 2,
    name: 'Фонд «Центр медицинских технологий»',
    category: 'Благотворительный фонд',
    image: 'http://65.109.88.77:9000/creative-kindness/person_2.jpg',
    description: 'Помогает людям с редкими заболеваниями получить доступ к современному лечению и медицинским технологиям.',
  },
  {
    id: 3,
    name: 'Студия социальной рекламы',
    category: 'Рекламное агентство',
    image: 'http://65.109.88.77:9000/creative-kindness/person_3.jpg',
    description: 'Создает эффективные рекламные кампании для привлечения внимания к социальным проблемам.',
   
  },
  {
    id: 4,
    name: 'Экологическая инициатива «Зеленый город»',
    category: 'Экологическая организация',
    image: 'http://65.109.88.77:9000/creative-kindness/person_4.jpg',
    description: 'Занимается озеленением городских пространств и экологическим просвещением населения.',

  },
  {
    id: 5,
    name: 'Центр помощи детям «Надежда»',
    category: 'Детский фонд',
    image: 'http://65.109.88.77:9000/creative-kindness/person_5.jpg',
    description: 'Оказывает комплексную поддержку детям из неблагополучных семей и детям-сиротам.',

  },
  {
    id: 6,
    name: 'IT-волонтеры «Цифровое добро»',
    category: 'IT-сообщество',
    image: 'http://65.109.88.77:9000/creative-kindness/Daniil_Kovekh.jpeg',
    description: 'Разрабатывает цифровые решения для НКО и помогает автоматизировать процессы в благотворительности.',
  },
  
]

export default function TeamsPage() {
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
        {teams.map((team) => (
          <div key={team.id} className="group">
            <Link href={`/teams/${slugify(team.name)}`} className="block">
              <div className="relative w-full overflow-hidden rounded-none" style={{ aspectRatio: '391/466' }}>
                <Image
                  src={team.image}
                  alt={team.name}
                  fill
                  className="object-cover"
                />
                {/* Overlay: visible on mobile, on hover on larger screens */}
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-2 text-white text-[12px] md:text-[20px]">
                    <span className="truncate">{team.name}</span>
                    <span>→</span>
                  </div>
                  <div className="text-[#B5B5B5] text-[12px] md:text-[20px] leading-snug">
                    {team.description}
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