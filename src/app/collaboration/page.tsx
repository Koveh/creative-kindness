import Image from 'next/image'

const minioUrl = process.env.NEXT_PUBLIC_MINIO_URL || 'http://localhost:9000'
const bucketName = process.env.MINIO_BUCKET || 'creative-kindness'

const cooperationData = [
  {
    id: 1,
    title: 'Благотворительность',
    description: 'Получите профессиональную поддержку от команды молодых специалистов под руководством экспертов. Мы создаем контент, проводим аудит digital-стратегии, разрабатываем креативные кампании.',
    image: `${minioUrl}/${bucketName}/coop.webp`,
    link: '#'
  },
  {
    id: 2,
    title: 'Креатор',
    description: 'Участвуйте в социально значимых проектах, получайте наставничество, расширяйте портфолио. Предлагаем проекты для специалистов любого уровня.',
    image: `${minioUrl}/${bucketName}/coop_1.webp`,
    link: '#'
  },
  {
    id: 3,
    title: 'Бизнес',
    description: 'Развивайте HR-бренд, получайте доступ к талантам, формируйте репутацию социально ответственной компании через участие в наших инициативах.',
    image: `${minioUrl}/${bucketName}/coop_2.webp`,
    link: '#'
  }
]

export default function CollaborationPage() {
  return (
    <div className="w-full">
      {/* Cooperation Section */}
      <div className="flex items-center justify-center py-8 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {cooperationData.map((item) => (
            <div key={item.id} className="text-left">
              <div className="relative w-full overflow-hidden rounded-none mb-6" style={{ aspectRatio: '412/465' }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <h3 className="text-[32px] font-normal text-gray-800 mb-[10px] text-left">
                {item.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-[20px] mb-4 text-left text-secondary">
                {item.description}
              </p>
              
              <a 
                href={item.link}
                className="text-gray-800 font-medium hover:opacity-70 transition-opacity text-left text-[20px]"
              >
                Заполнить анкету →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 