import Image from 'next/image'

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
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {creators.map((creator) => (
          <div key={creator.id} className="group">
            <div className="relative w-full overflow-hidden rounded-none mb-6" style={{ aspectRatio: '391/466' }}>
              <Image
                src={creator.image}
                alt={creator.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-medium text-primary mb-1">
                  {creator.name}
                </h3>
                <p className="text-secondary text-sm uppercase tracking-wide">
                  {creator.role}
                </p>
              </div>
              
              <p className="text-secondary leading-relaxed text-sm">
                {creator.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}