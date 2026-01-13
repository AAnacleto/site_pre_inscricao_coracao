'use client'

import { useState } from 'react'
import { ComponentesRepository } from '@/lib/respositories/preInscricao.repository'
import { toast } from 'sonner'
import { Instagram, Youtube, Camera } from 'lucide-react'


const TEMPORADA_ATUAL_ID = 'e6780310-32a1-434e-bd09-49189e8fabab'

function calcularIdade(dataNascimento: string) {
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)

  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }

  return idade
}

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [faqAberto, setFaqAberto] = useState<number | null>(null)

  const [form, setForm] = useState({
    nome_completo: '',
    nome_responsavel: '',
    data_nascimento: '',
    genero: '',
    telefone: '',
    estuda: '',
    email: '',
    escola: '',
  })

  const formularioValido =
    form.nome_completo.trim() !== '' &&
    form.nome_responsavel.trim() !== '' &&
    form.data_nascimento !== '' &&
    form.genero !== '' &&
    form.telefone.trim() !== '' &&
    (form.estuda !== 'sim' || form.escola.trim() !== '')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const idade = calcularIdade(form.data_nascimento)
    if (idade > 17) {
      toast.error(
        'A pré-inscrição é permitida apenas para crianças e adolescentes até 17 anos.'
      )
      return
    }

    setLoading(true)

    const { error } = await ComponentesRepository.criarPreInscricao({
      temporada_id: TEMPORADA_ATUAL_ID,
      nome_completo: form.nome_completo,
      nome_contato_responsavel: form.nome_responsavel,
      data_nascimento: form.data_nascimento,
      genero: form.genero as 'dama' | 'cavalheiro',
      telefone: form.telefone,
      email: form.email,
      estuda: form.estuda,
      escola: form.estuda === 'sim' ? form.escola : null,
    })

    setLoading(false)

    if (error) {
      console.error('ERRO SUPABASE:', error)
      toast.error(error.message ?? 'Erro ao enviar a pré-inscrição')
      return
    }

    toast.success('Pré-inscrição realizada com sucesso!')

    setForm({
      nome_completo: '',
      nome_responsavel: '',
      data_nascimento: '',
      genero: '',
      telefone: '',
      email: '',
      estuda: '',
      escola: '',
    })
  }

  const faqs = [
    {
      pergunta: 'Quando começam os ensaios?',
      resposta: 'Os ensaios começam após o período carnavalesco no dia 21 de fevereiro de 2026.',
    },
    {
      pergunta: 'O que eu preciso levar para primeiro ensaio?',
      resposta: 'Precisa levar sua garrafinha de água, ir calçado com tênis e roupa confortável.',
    },
    {
      pergunta: 'Onde será o local do primeiro ensaio?',
      resposta: 'Na Escola Sagrado Coração de Jesus, no endereço Rua Frei Afonso Maria, 199, Amaro Branco, Olinda - PE, CEP 53120-170',
    },
    {
      pergunta: 'Existe pagamento de taxa?',
      resposta: 'Sim. Informações sobre valores e formas de pagamento serão repassadas presencialmente.',
    },
    {
      pergunta: 'Quais são os próximos passos?',
      resposta: 'O responsável será chamado para concluir o cadastro, assinar os termos e entregar a documentação.',
    },
  ]

  return (
    <main className="min-h-screen bg-red-800 flex justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 md:p-12">
        {/* LOGOS */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
          <img
            src="/logos/logo-coracao-mirim.png"
            alt="Quadrilha Junina Coração Mirim"
            className="h-40 object-contain"
          />
          <img
            src="/logos/logo-centro-cultural.png"
            alt="Centro Cultural Coração"
            className="h-40 object-contain"
          />
        </div>

        {/* TÍTULO */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-black">
          Pré-Inscrição
        </h1>
        <p className="text-center text-gray-700 mb-10">
          Quadrilha Junina Coração Mirim - Temporada 2026 <br />
          Crianças e adolescentes até 17 anos
        </p>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          <input
            name="nome_completo"
            placeholder="Informe seu nome completo"
            required
            value={form.nome_completo}
            onChange={handleChange}
            className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 text-black bg-white"
          />

          {/* <input
            type="email"
            name="email"
            placeholder="E-mail do responsável (opcional)"
            value={form.email}
            onChange={handleChange}
            className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 text-black bg-white"
          /> */}

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="relative">
              <input
                type="date"
                name="data_nascimento"
                required
                value={form.data_nascimento}
                onChange={handleChange}
                className="
      peer
      w-full
      border border-gray-300
      rounded-lg
      px-4 py-4
      bg-white
      h-[56px]
      text-black
      [&::-webkit-datetime-edit]:opacity-0
      focus:[&::-webkit-datetime-edit]:opacity-100
      valid:[&::-webkit-datetime-edit]:opacity-100
    "
              />

              <label
                className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-gray-500
      text-sm
      transition-all
      pointer-events-none
      peer-focus:top-2
      peer-focus:text-xs
      peer-focus:text-red-800
      peer-valid:top-2
      peer-valid:text-xs
    "
              >
                Data de nascimento
              </label>
            </div>


            <select
              name="genero"
              required
              value={form.genero}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 text-black bg-white h-[56px] appearance-none"
            >
              <option value="">Gênero</option>
              <option value="dama">Dama</option>
              <option value="cavalheiro">Cavalheiro</option>
            </select>

          </div>


          <input
            name="nome_responsavel"
            placeholder="Informe o nome completo do responsável"
            required
            value={form.nome_responsavel}
            onChange={handleChange}
            className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 text-black bg-white"
          />

          <input
            name="telefone"
            placeholder="Informe o telefone do responsável"
            required
            value={form.telefone}
            onChange={handleChange}
            className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 text-black bg-white"
          />

          <select
            name="estuda"
            required
            value={form.estuda}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 text-black bg-white"
          >
            <option value="">Estuda atualmente?</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>

          {form.estuda === 'sim' && (
            <input
              name="escola"
              placeholder="Qual escola?"
              required
              value={form.escola}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 text-black bg-white"
            />
          )}

          <button
            type="submit"
            disabled={loading || !formularioValido}
            className={`md:col-span-2 font-semibold py-4 rounded-lg transition
              ${loading || !formularioValido
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-800 hover:bg-red-700 text-white'
              }`}
          >
            {loading ? 'Enviando...' : 'Enviar pré-inscrição'}
          </button>
        </form>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Dúvidas frequentes
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setFaqAberto(faqAberto === index ? null : index)}
                  className="w-full flex justify-between items-center px-4 py-3 font-semibold text-black hover:bg-gray-50 transition"
                >
                  {faq.pergunta}
                  <span>{faqAberto === index ? '−' : '+'}</span>
                </button>

                {faqAberto === index && (
                  <div className="px-4 pb-4 text-gray-700 bg-white">
                    {faq.resposta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        <br />
        <br />


        <footer className="w-full bg-gray-100 border-t border-gray-200 mt-10">
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center gap-4">

            {/* Texto convite */}
            <p className="text-sm text-gray-600 text-center">
              Acompanhe a <span className="font-semibold">Quadrilha Junina Coração Mirim</span>
              nas redes sociais e fique por dentro das novidades.
            </p>

            {/* Ícones das redes */}
            <div className="flex gap-6">
              <a
                href="https://www.instagram.com/qjuninacoracao/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <Instagram size={26} />
              </a>

              <a
                href="https://www.youtube.com/@QuadrilhaJuninaCoracaoOficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <Youtube size={26} />
              </a>

              <a
                href="https://www.flickr.com/photos/198833010@N07/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Flickr"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Camera size={26} />
              </a>
            </div>

            {/* Direitos autorais */}
            <p className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} Tríade Produções. Todos os direitos reservados.
            </p>
          </div>
        </footer>

      </div>
    </main>
  )
}