import { Request, Response } from 'express'
import shortId from 'shortid'
import { config } from '../config/Constants'
import { URLModel } from '../database/model/URL'

export class URLController {
	public async shorten(req: Request, response: Response): Promise<void> {
		// Ver se a URL ja nao existe
		// Criar o hash para esta URL
		// Salvar a URL no banco
		// Retornar a URL que foi salva
		const { originURL } = req.body
		const url = await URLModel.findOne({ originURL })
		if (url) {
			response.json(url)
			return
		}
		const hash = shortId.generate()
		const shortURL = `${config.API_URL}/${hash}`
		const newURL = await URLModel.create({ hash, shortURL, originURL })
		response.json(newURL)
	}

	public async redirect(req: Request, response: Response): Promise<void> {
		// Hash da URL	
		// Encontrar a URL Original através do Main
		// Redirecionar para URL original a partir do que encontramos no Banco de dados	
		const { hash } = req.params
		const url = await URLModel.findOne({ hash })

		if (url) {
			response.redirect(url.originURL)
			return
		}

		response.status(400).json({ error: 'URL não encontrada' })
	}
}
