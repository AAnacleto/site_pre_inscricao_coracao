import { supabase } from '@/lib/supabase'

export interface CriarPreInscricaoDTO {
  temporada_id: string
  nome_completo: string
  nome_contato_responsavel: string
  data_nascimento: string
  genero: 'dama' | 'cavalheiro'
  telefone: string
  email?: string | null
  escola?: string | null
}

export class ComponentesRepository {
  static async criarPreInscricao(dados: CriarPreInscricaoDTO) {
    const { error } = await supabase.from('componentes').insert([
      {
        temporada_id: dados.temporada_id,
        nome_completo: dados.nome_completo,
        nome_contato_responsavel: dados.nome_contato_responsavel,
        data_nascimento: dados.data_nascimento,
        genero: dados.genero,
        telefone: dados.telefone,
        email: dados.email ?? null,
        escola: dados.escola ?? null,
        status: 'pre-inscrito',
        observacoes: null,
      },
    ])

    // 👇 tratamento de erro
    if (error) {
      // duplicidade (constraint UNIQUE)
      if (error.code === '23505') {
        return {
          error: {
            message:
              'Já existe uma pré-inscrição com esses dados para esta temporada.',
          },
        }
      }

      // qualquer outro erro
      return { error }
    }

    return { error: null }
  }
}
