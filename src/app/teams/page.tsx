import Image from 'next/image'

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
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {teams.map((team) => (
          <div key={team.id} className="group">
            <div className="relative w-full overflow-hidden rounded-none mb-6" style={{ aspectRatio: '391/466' }}>
              <Image
                src={team.image}
                alt={team.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-medium text-primary mb-1">
                  {team.name}
                </h3>
                <p className="text-secondary text-sm uppercase tracking-wide">
                  {team.category}
                </p>
              </div>
              
              <p className="text-secondary leading-relaxed text-sm">
                {team.description}
              </p>
              
              {/* <div className="flex flex-wrap gap-2 pt-2">
                {team.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}