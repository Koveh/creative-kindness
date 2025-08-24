// Test content cleaning function
const testContent = ` В современном мире социальных проектов визуальная коммуникация играет ключевую роль в привлечении внимания 
к важным проблемам общества. Когда благотворительная организация годами работает в тени, не получая должного
 признания, требуется кардинальный пересмотр подхода к брендингу и коммуникациям.+



                                                                                 +
 Фонд «Центр медицинских технологий» (ЦМТ) долгое время помогал людям с редкими заболеваниями, но его деятельность оставалась незамеченной широкой общественностью. Проблема заключалась не в качестве работы организации, а в отсутствии эффективной стратегии визуальной коммуникации.                 +



                                                                                 +
 ## Анализ проблемы


                                                                                 +



                                                                                 +
 Креативная студия «ONY» провела комплексный анализ существующего образа фонда и выявила несколько ключевых проблем:
                                                                                 +



                                                                                 +
 - Отсутствие единой визуальной идентичности


                                                                                 +
 - Неэффективная коммуникация с целевой аудиторией


                                                                                 +
 - Слабое присутствие в цифровых каналах


                                                                                 +
 - Недостаток эмоциональной связи с потенциальными донорами


                                                                                 +



                                                                                 +
 Для решения этих задач была разработана комплексная стратегия ребрендинга, включающая создание нового логотипа, фирменного стиля и коммуникационной платформы.
                                                                                 +



                                                                                 +
 ## Процесс создания нового бренда


                                                                                 +



                                                                                 +
 Работа над новым образом фонда началась с глубокого погружения в деятельность организации. Команда студии изучила истории пациентов, познакомилась с врачами и волонтерами, чтобы понять истинную миссию ЦМТ.`;

// Helper function to extract headings from markdown content
const extractHeadings = (content) => {
  if (!content) return []
  
  // Clean the content first - remove extra formatting characters but preserve line structure
  const cleanContent = content
    .replace(/\+\s*\n/g, '\n') // Remove trailing + characters
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .replace(/^\s+|\s+$/gm, '') // Trim whitespace from each line
    .trim()
  
  console.log('Cleaned content preview:', cleanContent.substring(0, 300))
  
  // Simple and reliable regex for markdown headings
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings = []
  
  let match
  while ((match = headingRegex.exec(cleanContent)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    
    console.log(`Found heading: H${level} - "${text}"`)
    headings.push({ level, text, id })
  }
  
  console.log(`Total headings found: ${headings.length}`)
  return headings
}

// Test the function
console.log('Testing content cleaning and heading extraction...')
const headings = extractHeadings(testContent)
console.log('Final result:', headings) 