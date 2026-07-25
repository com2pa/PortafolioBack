import * as contactService from '../services/contact.service.js'
import { asyncHandler } from '../utils/helpers.js'

export const sendContact = asyncHandler(async (req, res) => {
  const result = await contactService.sendContactMessage(req.body)
  res.json({
    message: 'Mensaje enviado correctamente. Te responderé pronto.',
    ...result,
  })
})
