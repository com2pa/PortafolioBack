import bcrypt from 'bcrypt'
import { User } from '../models/User.js'
import { Project } from '../models/Project.js'
import { SiteContent } from '../models/SiteContent.js'
import { DEFAULT_SITE_CONTENT } from './defaultContent.js'
import { env } from '../config/env.js'

const SEED_PROJECTS = [
  {
    title: 'Plataforma de Gestión Académica',
    category: 'MERN',
    description:
      'Sistema full-stack para administración académica: autenticación JWT, paneles por rol y API REST con Node/Express + MongoDB.',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    demoUrl: 'https://example.com',
    stack: ['MongoDB', 'Express', 'React', 'Node'],
  },
  {
    title: 'Dashboard IoT / Robótica',
    category: 'Robótica',
    description:
      'Interfaz en tiempo real para telemetría de sensores y control de actuadores. Integración hardware/software vía WebSockets.',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
      'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?w=800&q=80',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    demoUrl: 'https://example.com',
    stack: ['React', 'Node', 'WebSockets', 'IoT'],
  },
  {
    title: 'Automatización de Flujos',
    category: 'Web',
    description:
      'Herramienta de automatización de procesos con colas, webhooks y panel de monitoreo. Enfoque en arquitectura modular y escalable.',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    demoUrl: 'https://example.com',
    stack: ['React', 'Node', 'API', 'Automatización'],
  },
]

export async function seedDatabase() {
  const { email, password, name } = env.admin

  const existingAdmin = await User.findOne({ email })
  if (!existingAdmin) {
    await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'admin',
    })
    console.log(`Admin creado: ${email}`)
  }

  const count = await Project.countDocuments()
  if (count === 0) {
    await Project.insertMany(SEED_PROJECTS)
    console.log('Proyectos seed insertados')
  } else {
    // Migración ligera: imageUrl -> images[]
    const legacy = await Project.find({
      $or: [{ images: { $exists: false } }, { images: { $size: 0 } }],
      imageUrl: { $exists: true, $ne: '' },
    })
    for (const project of legacy) {
      project.images = [project.imageUrl]
      await project.save()
    }
  }

  const content = await SiteContent.findOne({ key: 'main' })
  if (!content) {
    await SiteContent.create(DEFAULT_SITE_CONTENT)
    console.log('Contenido del sitio seed insertado')
  } else if (!content.contact?.youtubeUrl) {
    content.contact.youtubeUrl =
      content.contact.youtubeUrl || 'https://www.youtube.com'
    await content.save()
  }
}
